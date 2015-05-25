///<reference path="../../scripts/typings/validator/validator.d.ts"/>
import validator = require('validator');

import Request = require('../../lib/events/request');
import ArticleSource = require('./article-source');

import utils = require('./utils');

class ImportArticleRequest implements Request<ImportArticleRequest> {
    articleSource:ArticleSource;
    articleId:string;

    static validate(input:any):ImportArticleRequest {
        var req:ImportArticleRequest = new ImportArticleRequest();
        req.articleSource = utils.validateArticleSourceId(input);
        req.articleId = utils.validateString(input, 'ArticleId', true);
        return req;
    }
}

export = ImportArticleRequest;