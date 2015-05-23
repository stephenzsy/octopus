import moment = require('moment');
import validator = require('validator');

import Request = require('../../lib/events/request');
import utils = require('./utils');
import ArticleSource = require('./article-source');

class SyncArticlesIndexRequest implements Request<SyncArticlesIndexRequest> {
    articleSource: ArticleSource;
    indexId: string;

    static validate(input: any): SyncArticlesIndexRequest {
        var req: SyncArticlesIndexRequest = new SyncArticlesIndexRequest();
        req.articleSource = utils.validateArticleSourceId(input);
        req.indexId = utils.validateString(input, 'IndexId');
        return req;
    }
}

export = SyncArticlesIndexRequest;
