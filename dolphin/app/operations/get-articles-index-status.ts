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
import GetArticlesIndexStatusResult = require('../models/get-articles-index-status-result');
import ArticlesIndex = require('../document/articles-index');

class GetArticlesIndexStatus implements Operation<GenericArticlesRequest, GetArticlesIndexStatusResult> {
    name: string = 'GetArticlesIndexStatus';
    isAsync: boolean = true;

    private articlesIndex: ArticlesIndex;

    constructor(articlesIndex: ArticlesIndex) {
        this.articlesIndex = articlesIndex;
    }

    enact(req: GenericArticlesRequest): GetArticlesIndexStatusResult {
        throw 'WTF';
    }

    enactAsync(req: GenericArticlesRequest): Q.Promise<GetArticlesIndexStatusResult> {
        // TODO to be refactored and shared
        var offset: moment.Moment = req.endTimestamp || moment();
        var limit = req.limit;

        return this.articlesIndex.fetchIntervalsAsync(req.articleSource, offset, limit)
            .then(function (intervals: ArticlesIndex.Interval[]): GetArticlesIndexStatusResult {
            var result: GetArticlesIndexStatusResult = new GetArticlesIndexStatusResult();
            result.indexIntervals = intervals;
            return result;
        });
    }

    validateInput(input: any): GenericArticlesRequest {
        return GenericArticlesRequest.validate(input);
    }
}

export = GetArticlesIndexStatus;
