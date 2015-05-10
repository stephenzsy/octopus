import M = require('../../lib/events/operation');
import MRequest = require('../models/list-article-sources-request');
import MResult = require('../models/list-article-sources-result');
import MArticleSource = require('../models/article-source');

export module Dolphin.Api.Operations {
    import Operation = M.Dolphin.Events.Operation;
    import ListArticleSourcesRequest = MRequest.Dolphin.Api.Models.ListArticleSourcesRequest;
    import ListArticleSourcesResult = MResult.Dolphin.Api.Models.ListArticleSourcesResult;
    import ArticleSource = MArticleSource.Dolphin.Api.Models.ArticleSource;

    export class ListArticleSources implements Operation<ListArticleSourcesRequest, ListArticleSourcesResult> {
        name:string = 'ListArticleSources';

        enact(request:ListArticleSourcesRequest):ListArticleSourcesResult {
            var result:ListArticleSourcesResult = new ListArticleSourcesResult();
            result.ArticleSources = this.createStaticArticleSourcesList();
            return result;
        }

        private createStaticArticleSourcesList(): ArticleSource[] {
            var asBi:ArticleSource = new ArticleSource();
            asBi.Id = "bi";
            asBi.Name = "Business Intelligence";
            asBi.Url = "http://www.businessintelligence.com";
            return [ asBi ];
        }

        private static EMPTY_REQUEST:ListArticleSourcesRequest = new ListArticleSourcesRequest();

        // do not validate simply return empty request
        validateInput(input:any):ListArticleSourcesRequest {
            return ListArticleSources.EMPTY_REQUEST;
        }
    }
}
