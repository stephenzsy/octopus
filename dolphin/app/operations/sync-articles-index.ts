///<reference path="../../scripts/typings/q/Q.d.ts"/>
///<reference path="../../scripts/typings/moment/moment.d.ts"/>
///<reference path="../../scripts/typings/cheerio/cheerio.d.ts"/>
import Q = require('q');
import moment = require('moment');
import cheerio = require('cheerio');

import Operation = require('../../lib/events/operation');
import ArticleSource = require('../models/article-source');
import CapturedDocument = require('../document/import/captured-document');
import ArticlesIndexDocument = require('../document/index/articles-index-document');
import SyncArticlesIndexRequest = require('../models/sync-articles-index-request');
import SyncArticlesIndexResult = require('../models/import-articles-index-result');
import ArticlesIndex = require('../document/index/articles-index');
import ArticlesIndexImporter = require('../document/import/document-importer');
import ResourceNotFoundException = require('../models/resource-not-found-exception');

class SyncArticlesIndex implements Operation<SyncArticlesIndexRequest, SyncArticlesIndexResult> {
    name: string = 'SyncArticlesIndex';
    isAsync: boolean = true;

    private articlesIndex: ArticlesIndex;
    private importer: ArticlesIndexImporter;

    constructor(articlesIndex: ArticlesIndex, importer: ArticlesIndexImporter) {
        this.articlesIndex = articlesIndex;
        this.importer = importer;
    }

    enact(req:SyncArticlesIndexRequest):SyncArticlesIndexResult {
        throw 'WTF';
    }

    enactAsync(req:SyncArticlesIndexRequest):Q.Promise<SyncArticlesIndexResult> {
        var importer: ArticlesIndexImporter = this.importer;
        var articleSource: ArticleSource = req.articleSource;
        var articlesIndex: ArticlesIndex = this.articlesIndex;

        var indexInterval: ArticlesIndex.Interval;
        return articlesIndex.getIntervalAsync(articleSource, req.indexId)
            .then(function (interval: ArticlesIndex.Interval): Q.Promise<ArticlesIndexDocument> {
            indexInterval = interval;
            if (interval.status !== ArticlesIndex.Status.SourcePartial && interval.status !== ArticlesIndex.Status.SourceReady) {
                throw 'Not supported yet';
            }
            return importer.getImportedArticlesIndexDocumentAsync(articleSource, interval.archiveBucket, interval.indexId);
        }).then(function (doc: ArticlesIndexDocument): any {
            return articlesIndex.syncArticlesIndexDocumentAsync(articleSource, doc, indexInterval.indexedCount || 0);
        }).then(function (value: number): Q.Promise<ArticlesIndex.Interval> {
                indexInterval.indexedCount = (indexInterval.indexedCount || 0) + value;
            return articlesIndex.updateIntervalIndexedCountAsync(articleSource, indexInterval, (indexInterval.indexedCount || 0) + value);
        }).then(function (value: any): SyncArticlesIndexResult {
            return new SyncArticlesIndexResult();
        });
    }

    validateInput(input:any):SyncArticlesIndexRequest {
        return SyncArticlesIndexRequest.validate(input);
    }
}

export = SyncArticlesIndex;
