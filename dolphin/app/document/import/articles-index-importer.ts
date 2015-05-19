﻿import http = require('http');
import moment = require('moment');
import Q = require('q');
import cheerio = require('cheerio');

import utils = require('../utils');

import ArticleSource = require('../../models/article-source');
import DocumentStorage = require('../storage/document-storage');
import CapturedDocument = require('../import/captured-document');
import ArticlesIndexDocument = require('../index/articles-index-document');

class ArticlesIndexImporter {
    private docStore: DocumentStorage;

    constructor(docStore: DocumentStorage) {
        this.docStore = docStore;
    }

    private captureArticlesIndexAsync(articleSource: ArticleSource, indexInfo: ArticleSource.IndexInfo): Q.Promise<CapturedDocument> {
        var url: string = articleSource.getUrlForIndexId(indexInfo.indexId);
        var deferred: Q.Deferred<string> = Q.defer<string>();
        var timestamp: string = moment().utc().toISOString();
        http.get(url, (res: http.IncomingMessage): void => {
            utils.readableToStringAsync(res).then(function (content: string) {
                deferred.resolve(content);
            });
        });
        return deferred.promise.then(function (content: string): CapturedDocument {
            content = articleSource.dailyIndexSanitizer.sanitize(cheerio.load(content, {
                normalizeWhitespace: true
            })).html();
            var doc = new CapturedDocument();
            doc.articleSourceId = articleSource.Id;
            doc.archiveBucket = 'index/raw/' + indexInfo.archiveBucket;
            doc.documentId = indexInfo.indexId;
            doc.timestamp = timestamp;
            doc.content = content;
            doc.sourceUrl = url;
            doc.metadata = {
                'source-version': articleSource.version,
                'sanitizer-version': articleSource.dailyIndexSanitizer.version,
            }
            if (indexInfo.validAfter) {
                doc.metadata['valid-after'] = indexInfo.validAfter.utc().toISOString();
            }
            if (indexInfo.validBefore) {
                doc.metadata['valid-before'] = indexInfo.validBefore.utc().toISOString();
            }
            return doc;
        });
    }

    private isCapturedDocumentUpToDate(doc: CapturedDocument): boolean {

        var validAfter: string = doc.metadata['valid-after'];
        var validBefore: string = doc.metadata['valid-before'];
        if (validAfter || validBefore) {
            if (validAfter && moment(doc.timestamp).isAfter(moment(validAfter))) {
                return true;
            }
            if (validBefore && moment().isBefore(moment(validBefore))) {
                return true;
            }
        }
        return true;
    }

    importArticlesIndexAsync(articleSource: ArticleSource, timestamp: moment.Moment): Q.Promise<ArticlesIndexDocument> {
        var indexInfo: ArticleSource.IndexInfo = articleSource.getIndexInfoForTimestamp(timestamp);
        var importer: ArticlesIndexImporter = this;
        var docStore = this.docStore;
        return docStore.getArticlesIndexAsync(articleSource, 'index/json/' + indexInfo.archiveBucket, indexInfo.indexId).then(
            function (indexDoc: ArticlesIndexDocument): ArticlesIndexDocument | Q.Promise<ArticlesIndexDocument> {
                if (indexDoc != null && importer.isCapturedDocumentUpToDate(indexDoc)) {
                    return indexDoc;
                }
                // not found or up-to-date, parse it from source
                return docStore.getCapturedDocumentAsync(articleSource.Id, 'index/raw/' + indexInfo.archiveBucket, indexInfo.indexId).then(
                    function (capturedDocument: CapturedDocument): CapturedDocument|Q.Promise<CapturedDocument> {
                        if (capturedDocument != null && importer.isCapturedDocumentUpToDate(capturedDocument)) {
                            return capturedDocument;
                        }
                        // not found or up-to-date, import
                        return importer.captureArticlesIndexAsync(articleSource, indexInfo)
                            .then(function (doc: CapturedDocument): Q.Promise<CapturedDocument> {
                            return docStore.storeCapturedDocumentAsync(doc).then(function (r: any): CapturedDocument {
                                console.log(r);
                                return doc;
                            });
                        });
                    }).then(function (capturedDoc: CapturedDocument): ArticlesIndexDocument {
                    var parsed: any = articleSource.dailyIndexParser.parse(cheerio.load(capturedDoc.content));
                    // create ArticlesIndexDocument
                    var indexDoc = new ArticlesIndexDocument(articleSource);
                    indexDoc.archiveBucket = 'index/json/' + indexInfo.archiveBucket;
                    indexDoc.documentId = capturedDoc.documentId;
                    for (var k in capturedDoc.metadata) {
                        indexDoc.metadata[k] = indexDoc.metadata[k] || capturedDoc.metadata[k];
                    }
                    indexDoc.parserVersion = articleSource.dailyIndexParser.version;
                    indexDoc.parseTimestamp = moment().utc().toISOString();
                    indexDoc.setContentObject(parsed);
                    indexDoc.sourceUrl = capturedDoc.sourceUrl;
                    indexDoc.timestamp = capturedDoc.timestamp;
                    return indexDoc;
                }).then(function (indexDoc: ArticlesIndexDocument): Q.Promise<ArticlesIndexDocument> {
                    // store
                    return docStore.storeCapturedDocumentAsync(indexDoc).then(function (result: any): ArticlesIndexDocument {
                        return indexDoc;
                    });
                });
            });
    }
}

export = ArticlesIndexImporter;
