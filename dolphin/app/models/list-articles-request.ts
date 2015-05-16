import Request = require('../../lib/events/request');

class ListArticlesRequest implements Request<ListArticlesRequest> {
    ArticleSourceId: string;
    StartTimestamp: string;
    EndTimestamp: string;
    Limit: number;
}

export = ListArticlesRequest;
