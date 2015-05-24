///<reference path="../../scripts/typings/q/Q.d.ts"/>
///<reference path="../../scripts/typings/moment/moment.d.ts"/>
///<reference path="../../scripts/typings/cheerio/cheerio.d.ts"/>
import Q = require('q');
import moment = require('moment');
import cheerio = require('cheerio');

import Operation = require('../../lib/events/operation');
import ArticleSource = require('../models/article-source');
import ListArticlesRequest = require('../models/list-articles-request');
import ListArticlesResult = require('../models/list-articles-result');
import articleSources = require('../config/article-sources');
import AwsDocumentStorage = require('../document/storage/aws-document-storage');
import ArticlesIndex = require('../document/index/articles-index');
import Article = require('../document/article');

class ListArticles implements Operation<ListArticlesRequest, ListArticlesResult> {
    name: string = 'ListArticles';
    isAsync:boolean = true;

    private articlesIndex:ArticlesIndex;

    constructor(articlesIndex:ArticlesIndex) {
        this.articlesIndex = articlesIndex;
    }

    enact(req: ListArticlesRequest): ListArticlesResult {
        return null;
    }

    enactAsync(req:ListArticlesRequest):Q.Promise<ListArticlesResult> {
        if (req.status) {
            return this.articlesIndex.fetchArticlesByStatusAsync(req.articleSource, req.status, req.limit)
                .then(function (articles:Article[]):ListArticlesResult {
                    var result:ListArticlesResult = new ListArticlesResult();
                    result.articles = articles;
                    return result;
                })
        }
        return null;
    }

    validateInput(input: any): ListArticlesRequest {
        return ListArticlesRequest.validate(input);
    }
}

export = ListArticles;
