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
import ImportArticlesIndexResult = require('../models/import-articles-index-result');
import ArticlesIndex = require('../document/articles-index');
import ArticlesIndexImporter = require('../document/import/articles-index-importer');

class ImportArticlesIndex implements Operation<GenericArticlesRequest, ImportArticlesIndexResult> {
    name: string = 'ImportArticlesIndex';
    isAsync: boolean = true;

    private articlesIndex: ArticlesIndex;
    private importer: ArticlesIndexImporter;

    constructor(articlesIndex: ArticlesIndex, importer: ArticlesIndexImporter) {
        this.articlesIndex = articlesIndex;
        this.importer = importer;
    }

    enact(req: GenericArticlesRequest): ImportArticlesIndexResult {
        throw 'WTF';
    }

    enactAsync(req: GenericArticlesRequest): Q.Promise<ImportArticlesIndexResult> {
        var offset: moment.Moment = req.endTimestamp;
        var articlesIndex: ArticlesIndex = this.articlesIndex;
        return this.importer.importArticlesIndexAsync(req.articleSource, offset)
            .then(function (doc: ArticlesIndexDocument): Q.Promise<ArticlesIndex.Interval> {
            return articlesIndex.markSourceStatusAsync(doc);
        }).then(function (interval: ArticlesIndex.Interval): ImportArticlesIndexResult {
            var result: ImportArticlesIndexResult = new ImportArticlesIndexResult();
            return result;
        });
    }

    validateInput(input: any): GenericArticlesRequest {
        return GenericArticlesRequest.validate(input);
    }
}

export = ImportArticlesIndex;
