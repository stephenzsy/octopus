import Request = require('../../lib/events/request');
import ArticleSource = require('./article-source');

import opUtils = require('./utils');

class SyncArticleIndexRequest implements Request<SyncArticleIndexRequest> {
    articleSource: ArticleSource;

    StartTimestamp: string;
    EndTimestamp: string;
    Limit: number;

    static validate(input: any): SyncArticleIndexRequest {
        var req: SyncArticleIndexRequest = new SyncArticleIndexRequest();
        req.articleSource = opUtils.validateArticleSourceId(input);
        return req;
    }
}

export = SyncArticleIndexRequest;
