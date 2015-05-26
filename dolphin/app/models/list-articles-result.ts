import Result = require('../../lib/events/result');
import ArticleSource = require('./article-source');
import Article = require('../document/article')

class ListArticlesResult implements Result<ListArticlesResult> {
    articles:Article[];

    toJsonObject(): any {
        return {
            "Articles": this.articles.map(function(article:Article):any{
                var d = {
                    "ArticleId": article.articleId,
                    "Status": article.status,
                    "SourceUrl": article.sourceUrl
                };
                if (article.title) {
                    d['Title'] = article.title;
                }
                if (article.timestamp) {
                    d['Timestamp'] = article.timestamp;
                }
                return d;
            })
        }
    }
}

export = ListArticlesResult;
