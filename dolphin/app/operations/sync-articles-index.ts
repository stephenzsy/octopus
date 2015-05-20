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
import ImportArticlesIndexResult = require('../models/import-articles-index-result');
import ArticlesIndex = require('../document/articles-index');
import ArticlesIndexImporter = require('../document/import/articles-index-importer');
import ResourceNotFoundException = require('../models/resource-not-found-exception');

class ImportArticlesIndex implements Operation<SyncArticlesIndexRequest, ImportArticlesIndexResult> {
    name: string = 'ImportArticlesIndex';
    isAsync: boolean = true;

    private articlesIndex: ArticlesIndex;
    private importer: ArticlesIndexImporter;

    constructor(articlesIndex: ArticlesIndex, importer: ArticlesIndexImporter) {
        this.articlesIndex = articlesIndex;
        this.importer = importer;
    }

    enact(req: SyncArticlesIndexRequest): ImportArticlesIndexResult {
        throw 'WTF';
    }

    enactAsync(req: SyncArticlesIndexRequest): Q.Promise<ImportArticlesIndexResult> {
        var articlesIndex: ArticlesIndex = articlesIndex;
        this.importer.getImportedArticlesIndexDocumentAsync(req.articleSource, req.archiveBucket, req.indexId).then(
            function (doc: ArticlesIndexDocument): Q.Promise<ArticlesIndex.Interval[]> {
                if (doc == null) {
                    throw new ResourceNotFoundException('InvalidArticlesIndex.NotFound', 'Articles index document not found for the request');
                }
                return articlesIndex.syncArticlesIndexDocumentAsync(doc);
            });
        return null;
    }

    validateInput(input: any): SyncArticlesIndexRequest {
        return SyncArticlesIndexRequest.validate(input);
    }
}

export = ImportArticlesIndex;
