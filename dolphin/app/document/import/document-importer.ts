///<reference path="../../../scripts/typings/node/node.d.ts"/>
///<reference path="../../../scripts/typings/q/Q.d.ts"/>

import http = require('http');
import moment = require('moment');
import Q = require('q');
import cheerio = require('cheerio');

import utils = require('../utils');

import Article = require('../article');
import ArticleSource = require('../../models/article-source');
import DocumentStorage = require('../storage/document-storage');
import CapturedDocument = require('../import/captured-document');
import ArticlesIndexDocument = require('../index/articles-index-document');
import HtmlSanitizer = require('../transform/html-sanitizer');

class DocumentImporter {
    private docStore: DocumentStorage;

    constructor(docStore: DocumentStorage) {
        this.docStore = docStore;
    }

    private httpGet(url:string):Q.Promise<string> {
        var deferred:Q.Deferred<string> = Q.defer<string>();
        http.get(url, (res:http.IncomingMessage):void => {
            utils.readableToStringAsync(res).then(function (content:string) {
                deferred.resolve(content);
            });
        });
        return deferred.promise;
    }

    private sanitize(sanitizer:HtmlSanitizer, content:string):string {
        return sanitizer.sanitize(cheerio.load(content, {
            normalizeWhitespace: true
        })).html();
    }

    private static mergeMetadata(to:{[s:string]:string}, from:{[s:string]:string}) {
        for (var key in from) {
            to[key] = from[key];
        }
    }

    private captureArticleAsync(article:Article):Q.Promise<CapturedDocument> {
        var _cthis:DocumentImporter = this;
        var timestamp = moment.utc();
        return this.httpGet(article.sourceUrl).then(function (content:string) {
            content = _cthis.sanitize(article.articleSource.articleSanitizer, content);
            var doc = new CapturedDocument();
            doc.articleSourceId = article.articleSourceId;
            doc.archiveBucket = article.archiveBucket;
            doc.documentId = article.articleId;
            doc.documentType = CapturedDocument.DocumentType.ArticleRaw;
            doc.timestamp = timestamp.toISOString();
            doc.content = content;
            doc.sourceUrl = article.sourceUrl;
            doc.metadata['source-version'] = article.articleSource.version;
            doc.metadata['sanitizer-version'] = article.articleSource.articleSanitizer.version;
            DocumentImporter.mergeMetadata(doc.metadata, article.metadata);
            return doc;
        });
    }

    private captureArticlesIndexAsync(articleSource: ArticleSource, indexInfo: ArticleSource.IndexInfo): Q.Promise<CapturedDocument> {
        var url: string = articleSource.getUrlForIndexId(indexInfo.indexId);
        var _cthis:DocumentImporter = this;
        var timestamp = moment.utc();
        return this.httpGet(url).then(function (content:string):CapturedDocument {
            content = _cthis.sanitize(articleSource.dailyIndexSanitizer, content);
            var doc = new CapturedDocument();
            doc.articleSourceId = articleSource.Id;
            doc.archiveBucket = indexInfo.archiveBucket;
            doc.documentType = CapturedDocument.DocumentType.IndexRaw;
            doc.documentId = indexInfo.indexId;
            doc.timestamp = timestamp.toISOString();
            doc.content = content;
            doc.sourceUrl = url;
            doc.metadata['source-version'] = articleSource.version;
            doc.metadata['sanitizer-version'] = articleSource.dailyIndexSanitizer.version;
            articleSource.validateDocument(doc);
            return doc;
        });
    }

    private isCapturedDocumentUpToDate(doc: CapturedDocument): boolean {
        var validBefore: string = doc.validBeforeTimestamp;
        if (validBefore) {
            if (moment().isBefore(moment(validBefore))) {
                return true;
            }
            return false;
        }
        return true;
    }

    getImportedArticlesIndexDocumentAsync(articleSource: ArticleSource, archiveBucket: string, indexId: string): Q.Promise<ArticlesIndexDocument> {
        return this.docStore.getArticlesIndexAsync(articleSource, archiveBucket, indexId);
    }

    importArticlesIndexAsync(articleSource: ArticleSource, timestamp: moment.Moment): Q.Promise<ArticlesIndexDocument> {
        var indexInfo: ArticleSource.IndexInfo = articleSource.getIndexInfoForTimestamp(timestamp);
        var importer:DocumentImporter = this;
        var docStore = this.docStore;
        return this.captureArticlesIndexAsync(articleSource, indexInfo)
            .then(function (doc:CapturedDocument):Q.Promise<CapturedDocument> {
                // store the captured document
                return docStore.storeCapturedDocumentAsync(doc).then(function (r:any):CapturedDocument {
                    return doc;
                });
            }).then(function (capturedDoc:CapturedDocument):ArticlesIndexDocument {
                var parsed:any = articleSource.dailyIndexParser.parse(cheerio.load(capturedDoc.content));
                // create ArticlesIndexDocument
                var indexDoc = new ArticlesIndexDocument(articleSource);
                indexDoc.archiveBucket = capturedDoc.archiveBucket;
                indexDoc.documentId = capturedDoc.documentId;
               DocumentImporter.mergeMetadata(indexDoc.metadata, capturedDoc.metadata);
                indexDoc.parserVersion = articleSource.dailyIndexParser.version;
                indexDoc.parseTimestamp = moment().utc().toISOString();
                indexDoc.setContentObject(parsed);
                return indexDoc;
            }).then(function (indexDoc:ArticlesIndexDocument):Q.Promise<ArticlesIndexDocument> {
                // store parsed document
                return docStore.storeCapturedDocumentAsync(indexDoc).then(function (result:any):ArticlesIndexDocument {
                    return indexDoc;
                });
            });
    }

    importArticleAsync(article:Article):Q.Promise<any> {
        var _cthis = this;
        return this.captureArticleAsync(article)
            .then(function (doc:CapturedDocument):Q.Promise<CapturedDocument> {
                return _cthis.docStore.storeCapturedDocumentAsync(doc)
                    .then(function (r:any):CapturedDocument {
                        return doc;
                    });
            }).then(function (capturedDoc:CapturedDocument):any {
                var parsed:any = article.articleSource.articleParser.parse(cheerio.load(capturedDoc.content));
                console.log(parsed);
                // set fields for article

                DocumentImporter.mergeMetadata(article.metadata, capturedDoc.metadata);
                /*
                indexDoc.parserVersion = articleSource.dailyIndexParser.version;
                indexDoc.parseTimestamp = moment().utc().toISOString();
                indexDoc.setContentObject(parsed);
                */
                return article;
            });
    }
}

export = DocumentImporter;
