///<reference path="../../scripts/typings/q/Q.d.ts"/>
///<reference path="../../scripts/typings/moment/moment.d.ts"/>
///<reference path="../../scripts/typings/cheerio/cheerio.d.ts"/>
import Q = require('q');
import moment = require('moment');
import cheerio = require('cheerio');

import Operation = require('../../lib/events/operation');
import ArticleSource = require('../models/article-source');
import CapturedDocument = require('../document/import/captured-document');
import GenericArticlesRequest = require('../models/generic-articles-request');
import ImportArticlesIndexResult = require('../models/import-articles-index-result');
import ArticlesIndex = require('../document/articles-index');
import IndexInterval = require('../document/articles-index-interval');
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
        // TODO to be refactored and shared
        var forward: boolean = false;
        var offset: moment.Moment = req.endTimestamp;
        if (req.startTimestamp && !req.endTimestamp) {
            forward = false;
            offset = req.startTimestamp;
        }
        var durationSeconds: number = null;
        if (req.startTimestamp && req.endTimestamp) {
            durationSeconds = req.endTimestamp.diff(req.startTimestamp, 'second');
        }

        return this.importer.importArticlesIndexAsync(req.articleSource, offset).then(function (capturedDoc: CapturedDocument): ImportArticlesIndexResult {
            return new ImportArticlesIndexResult();
        });
    }

    validateInput(input: any): GenericArticlesRequest {
        return GenericArticlesRequest.validate(input);
    }
}

export = ImportArticlesIndex;
