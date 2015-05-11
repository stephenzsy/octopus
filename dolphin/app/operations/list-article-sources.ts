import Operation = require('../../lib/events/operation');
import ArticleSource = require('../models/article-source');
import ListArticleSourcesRequest = require('../models/list-article-sources-request');
import ListArticleSourcesResult = require('../models/list-article-sources-result');

class ListArticleSources implements Operation<ListArticleSourcesRequest, ListArticleSourcesResult> {
    name:string = 'ListArticleSources';

    enact(request:ListArticleSourcesRequest):ListArticleSourcesResult {
        var result:ListArticleSourcesResult = new ListArticleSourcesResult();
        result.ArticleSources = this.createStaticArticleSourcesList();
        return result;
    }

    private createStaticArticleSourcesList():ArticleSource[] {
        var asBi:ArticleSource = new ArticleSource();
        asBi.Id = "bi";
        asBi.Name = "Business Intelligence";
        asBi.Url = "http://www.businessintelligence.com";
        return [asBi];
    }

    private static EMPTY_REQUEST:ListArticleSourcesRequest = new ListArticleSourcesRequest();

    // do not validate simply return empty request
    validateInput(input:any):ListArticleSourcesRequest {
        return ListArticleSources.EMPTY_REQUEST;
    }
}

export = ListArticleSources
