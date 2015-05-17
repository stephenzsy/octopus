import moment = require('moment');

import Request = require('../../lib/events/request');
import utils = require('./utils');
import ArticleSource = require('./article-source');

class GenericArticlesRequest implements Request<GenericArticlesRequest> {
    articleSource: ArticleSource;
    startTimestamp: moment.Moment;
    endTimestamp: moment.Moment;
    limit: number;

    static validate(input: any): GenericArticlesRequest {
        var req: GenericArticlesRequest = new GenericArticlesRequest();
        req.articleSource = utils.validateArticleSourceId(input);
        req.startTimestamp = utils.validateTimestamp(input, 'StartTimestamp');
        req.endTimestamp = utils.validateTimestamp(input, 'EndTimestamp');
        req.limit = utils.validateNumber(input, 'Limit', 10, 500, 20);

        // if both not set, use now as end timestamp
        if (!req.startTimestamp && !req.endTimestamp) {
            req.endTimestamp = moment();
        }

        return req;
    }
}

export = GenericArticlesRequest;
