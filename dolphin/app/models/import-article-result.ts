import Result = require('../../lib/events/result');
import Article = require('../document/article');

class ImportArticleResult implements Result<ImportArticleResult> {
    article:Article;

    toJsonObject():any {
        return {
            "Article": this.article.toJsonObject()
        };
    }
}

export = ImportArticleResult;
