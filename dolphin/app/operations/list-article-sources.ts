import Operation = require('../../lib/events/operation');
import ArticleSource = require('../models/article-source');
import ListArticleSourcesRequest = require('../models/list-article-sources-request');
import ListArticleSourcesResult = require('../models/list-article-sources-result');
import articleSources = require('../config/article-sources');

'use strcit';

class ListArticleSources implements Operation<ListArticleSourcesRequest, ListArticleSourcesResult> {
    name:string = 'ListArticleSources';

    private articleSourcesList:ArticleSource[] = [];

    constructor() {
        for(var key in articleSources) {
           this.articleSourcesList.push(articleSources[key]);
        }
    }

    enact(request:ListArticleSourcesRequest):ListArticleSourcesResult {
        var result:ListArticleSourcesResult = new ListArticleSourcesResult();
        result.ArticleSources = this.articleSourcesList;
        return result;
    }

    private static EMPTY_REQUEST:ListArticleSourcesRequest = new ListArticleSourcesRequest();

    // do not validate simply return empty request
    validateInput(input:any):ListArticleSourcesRequest {
        return ListArticleSources.EMPTY_REQUEST;
    }
}

export = ListArticleSources
