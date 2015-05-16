import Result = require('../../lib/events/result');
import ArticleSource = require('./article-source');

class ListArticlesResult implements Result<ListArticlesResult> {
    toJsonObject(): any {
        return {
            "ArticlesMetadata": []
        }
    }
}

export = ListArticlesResult;
