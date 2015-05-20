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
import GenericArticlesRequest = require('../models/generic-articles-request');
import SyncArticlesIndexResult = require('../models/import-articles-index-result');
import ArticlesIndex = require('../document/articles-index');
import ArticlesIndexImporter = require('../document/import/articles-index-importer');
import ResourceNotFoundException = require('../models/resource-not-found-exception');

class SyncArticlesIndex implements Operation<GenericArticlesRequest, SyncArticlesIndexResult> {
    name: string = 'SyncArticlesIndex';
    isAsync: boolean = true;

    private articlesIndex: ArticlesIndex;
    private importer: ArticlesIndexImporter;

    constructor(articlesIndex: ArticlesIndex, importer: ArticlesIndexImporter) {
        this.articlesIndex = articlesIndex;
        this.importer = importer;
    }

    enact(req: GenericArticlesRequest): SyncArticlesIndexResult {
        throw 'WTF';
    }

    enactAsync(req: GenericArticlesRequest): Q.Promise<SyncArticlesIndexResult> {
        var importer: ArticlesIndexImporter = this.importer;
        var articleSource: ArticleSource = req.articleSource;
        return this.articlesIndex.getIntervalAsync(articleSource, req.startTimestamp)
            .then(function (interval: ArticlesIndex.Interval): Q.Promise<ArticlesIndexDocument> {
            if (interval.status !== ArticlesIndex.Status.SourcePartial && interval.status !== ArticlesIndex.Status.SourceReady) {
                throw 'Not supported yet';
            }
            return importer.getImportedArticlesIndexDocumentAsync(articleSource, interval.archiveBucket, interval.indexId);
        }).then(function (doc: ArticlesIndexDocument): SyncArticlesIndexResult {
            console.log(doc);
            return new SyncArticlesIndexResult();
        });
    }

    validateInput(input: any): GenericArticlesRequest {
        return GenericArticlesRequest.validate(input);
    }
}

export = SyncArticlesIndex;
