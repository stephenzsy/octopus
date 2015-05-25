import http = require('http');
import crypto = require('crypto');

///<reference path="../../scripts/typings/q/Q.d.ts"/>
///<reference path="../../scripts/typings/moment/moment.d.ts"/>
///<reference path="../../scripts/typings/cheerio/cheerio.d.ts"/>
import Q = require('q');
import moment = require('moment');
import cheerio = require('cheerio');

import Operation = require('../../lib/events/operation');
import ArticleSource = require('../models/article-source');
import CapturedDocument = require('../document/import/captured-document');
import ImportArticleRequest = require('../models/import-article-request');
import ImportArticleResult = require('../models/import-article-result');
import DocumentImporter = require('../document/import/document-importer');
import ArticlesIndex = require('../document/index/articles-index');
import Article= require("../document/article");

'use strcit';

class ImportArticle implements Operation<ImportArticleRequest, ImportArticleResult> {
    name:string = 'ImportArticle';
    isAsync:boolean = true;

    private articlesIndex:ArticlesIndex;
    private docImporter:DocumentImporter;

    constructor(articlesIndex:ArticlesIndex, documentImporter:DocumentImporter) {
        this.articlesIndex = articlesIndex;
        this.docImporter = documentImporter;
    }

    enact(request:ImportArticleRequest):ImportArticleResult {
        throw 'WTF';
    }

    enactAsync(req:ImportArticleRequest):Q.Promise<ImportArticleResult> {
        var _cthis = this;
        var _article:Article;
        return this.articlesIndex.getArticleAsync(req.articleSource, req.articleId).then(function (article:Article) {
            _article = article;
            return _cthis.docImporter.importArticleAsync(article);
        }).then(function (r:any):ImportArticleResult {
            var result:ImportArticleResult = new ImportArticleResult();
            result.article = _article;
            return result;
        });
    }

    validateInput(input:any):ImportArticleRequest {
        return ImportArticleRequest.validate(input);
    }
}

export = ImportArticle;
