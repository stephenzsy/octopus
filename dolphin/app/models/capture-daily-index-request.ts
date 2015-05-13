///<reference path="../../scripts/typings/validator/validator.d.ts"/>
import validator = require('validator');

import Request = require('../../lib/events/request');
import InvalidRequestException = require('../../lib/events/invalid-request-exception');
import ResourceNotFoundException = require('./resource-not-found-exception');
import articleSources = require('../config/article-sources');
import ArticleSource = require('./article-source');

class CaptureDailyIndexRequest implements Request<CaptureDailyIndexRequest> {
    ArticleSourceId:string;
    DailyIndexId:string;
    MetadataOnly:boolean = false;

    private _articleSource;

    static validate(input:any):CaptureDailyIndexRequest {
        var req:CaptureDailyIndexRequest = new CaptureDailyIndexRequest();
        req.ArticleSourceId = validator.toString(input['ArticleSourceId']);
        if (req.ArticleSourceId) {
            if (articleSources[req.ArticleSourceId]) {
                req._articleSource = articleSources[req.ArticleSourceId];
            } else {
                throw new ResourceNotFoundException(ResourceNotFoundException.Code.InvalidArticleSourceId, 'Article Source ID not found: ' + req.ArticleSourceId);
            }
        } else {
            throw InvalidRequestException.missingRequiredField('ArticleSourceId');
        }
        req.DailyIndexId = validator.toString(input['DailyIndexId']);
        if (req.DailyIndexId) {
            if (!req.articleSource.isValidDailyIndexId(req.DailyIndexId)) {
                throw new ResourceNotFoundException(ResourceNotFoundException.Code.InvalidDailyIndexId, 'Invalid Daily Index ID: ' + req.DailyIndexId);
            }
        } else {
            throw InvalidRequestException.missingRequiredField('DailyIndexId');
        }
        if (validator.toBoolean(input['metadata'], true)) {
            req.MetadataOnly = true;
        }
        return req;
    }

    get articleSource():ArticleSource {
        return this._articleSource;
    }
}

export = CaptureDailyIndexRequest;