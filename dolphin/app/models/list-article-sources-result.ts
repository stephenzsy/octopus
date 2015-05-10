import Result = require('../../lib/events/result');
import ArticleSource = require('./article-source');


class ListArticleSourcesResult implements Result<ListArticleSourcesResult> {
    ArticleSources:ArticleSource[];

    toJsonObject():any {
        return {
            "ArticleSources": this.ArticleSources.map((articleSource:ArticleSource):any=> {
                return articleSource.toJsonObject();
            })
        };
    }
}

export  = ListArticleSourcesResult;
