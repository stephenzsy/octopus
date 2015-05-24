import moment = require('moment');

import Request = require('../../lib/events/request');
import utils = require('./utils');
import ArticleSource = require('./article-source');

class ListArticlesRequest implements Request<ListArticlesRequest> {
    articleSource: ArticleSource;
    status: string;
    limit: number;

    static validate(input: any): ListArticlesRequest {
        var req: ListArticlesRequest = new ListArticlesRequest();
        req.articleSource = utils.validateArticleSourceId(input);
        req.status = utils.validateString(input, 'Status', false);
        req.limit = utils.validateNumber(input, 'Limit', 10, 500, 20);

        return req;
    }
}

export = ListArticlesRequest;
