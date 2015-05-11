///<reference path="../../scripts/typings/validator/validator.d.ts"/>
import validator = require('validator');

import Request = require('../../lib/events/request');
import InvalidRequestException = require('../../lib/events/invalid-request-exception');
import ResourceNotFoundException = require('./resource-not-found-exception');
import articleSources = require('../config/article-sources');
import ArticleSource = require('./article-source');

class ListDailyIndicesRequest implements Request<ListDailyIndicesRequest> {
    ArticleSourceId:string;
    EndDateTime:string = null; // date time in ISO8601 ignored for now
    Limit:number = 10; // settable in the future

    private _articleSource;

    static validate(input:any):ListDailyIndicesRequest {
        var req:ListDailyIndicesRequest = new ListDailyIndicesRequest();
        req.ArticleSourceId = input['ArticleSourceId'];
        if (req.ArticleSourceId) {
            if (articleSources[req.ArticleSourceId]) {
                req._articleSource = articleSources[req.ArticleSourceId];
            } else {
                throw new ResourceNotFoundException(ResourceNotFoundException.Code.InvalidArticleSourceId, 'Article Source ID not found: ' + req.ArticleSourceId);
            }
        } else {
            throw InvalidRequestException.missingRequiredField('ArticleSourceId');
        }
        return req;
    }

    get articleSource():ArticleSource {
        return this._articleSource;
    }
}

export = ListDailyIndicesRequest;