import Result = require('../../lib/events/result');
import ArticleSource = require('./article-source');

class SyncArticleIndexResult implements Result<SyncArticleIndexResult> {
    toJsonObject(): any {
        return {
            "ArticlesMetadata": []
        };
    }
}

export = SyncArticleIndexResult;
