﻿import http = require('http');
import moment = require('moment');
import Q = require('q');
import cheerio = require('cheerio');

import utils = require('../utils');

import ArticleSource = require('../../models/article-source');
import DocumentStorage = require('../storage/document-storage');
import CapturedDocument = require('../import/captured-document');

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
            doc.archiveBucket = indexInfo.archiveBucket;
            doc.documentId = indexInfo.indexId;
            doc.timestamp = timestamp;
            doc.content = content;
            doc.sourceUrl = url;
            doc.metadata = {
                'source-version': articleSource.version,
                'sanitizer-version': articleSource.dailyIndexSanitizer.version,
            }
            return doc;
        });
    }

    importArticlesIndexAsync(articleSource: ArticleSource, timestamp: moment.Moment): Q.Promise<any> {
        var indexInfo: ArticleSource.IndexInfo = articleSource.getIndexInfoForTimestamp(timestamp);
        var importer: ArticlesIndexImporter = this;
        var docStore = this.docStore;
        return docStore.getCapturedDocumentAsync(articleSource.Id, indexInfo.archiveBucket, indexInfo.indexId).then(
            function (capturedDocument: CapturedDocument): CapturedDocument|Q.Promise<CapturedDocument> {
                if (capturedDocument != null && articleSource.isCapturedDocumentUpToDate(capturedDocument)) {
                    return capturedDocument;
                }
                // not found or up-to-date, import again
                return importer.captureArticlesIndexAsync(articleSource, indexInfo)
                    .then(function (doc: CapturedDocument): Q.Promise<CapturedDocument> {
                    return docStore.storeCapturedDocumentAsync(doc).then(function (r: any): CapturedDocument {
                        console.log(r);
                        return doc;
                    });
                });
            });
    }
}

export = ArticlesIndexImporter;
