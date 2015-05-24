import Result = require('../../lib/events/result');
import ArticleSource = require('./article-source');
import Article = require('../document/article')

class ListArticlesResult implements Result<ListArticlesResult> {
    articles:Article[];

    toJsonObject(): any {
        return {
            "Articles": this.articles.map(function(article:Article):any{
                return {
                    "ArticleId": article.articleId,
                    "Status": article.status,
                    "SourceUrl": article.sourceUrl
                }
            })
        }
    }
}

export = ListArticlesResult;
