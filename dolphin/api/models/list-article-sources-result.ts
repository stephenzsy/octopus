///<reference path="../../lib/events/operation.ts"/>

import MResult = require('../../lib/events/result');
import MArticleSource = require('./article-source');

import Result = MResult.Dolphin.Events.Result;
import ArticleSource = MArticleSource.Dolphin.Api.Models.ArticleSource;

export module Dolphin.Api.Models {
    export class ListArticleSourcesResult implements Result<ListArticleSourcesResult> {
        ArticleSources:ArticleSource[];

        toJsonObject():any {
            return {
                "ArticleSources": this.ArticleSources.map((articleSource:ArticleSource):any=> {
                    articleSource.toJsonObject()
                })
            }
        }
    }
}
