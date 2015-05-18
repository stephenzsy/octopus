///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>
///<reference path="../../../scripts/typings/angularjs/angular-route.d.ts"/>

///<reference path="./app.ts"/>
///<reference path="./client.ts"/>
'use strict';

module Dolphin.Controller {
    export interface IArticleSourceScope extends ng.IScope {
        dailyIndicesMetadata: Client.Models.DailyIndexMetadata[];
        articleSourceId: string;
        captureOriginal: (dailyIndexId: string) => void;
        indexStatus: Client.Models.ArticlesIndexStatusInterval[];
        importArticlesIndex: (startTs:string, endTs: string) => void;
    }

    export interface IArticleSourceRouteParams extends ng.route.IRouteParamsService {
        article_source_id: string;
    }
}

angular.module('dolphin').controller('ArticleSourceController', ['$scope', 'DolphinClient', '$routeParams',
    ($scope: Dolphin.Controller.IArticleSourceScope, client: Dolphin.Client.DolphinClient, $routeParams: Dolphin.Controller.IArticleSourceRouteParams) => {
        var articleSourceId: string = $routeParams.article_source_id;
        $scope.articleSourceId = articleSourceId;
        client.ListDailyIndices({ ArticleSourceId: articleSourceId }).then((result: Dolphin.Client.Models.ListDailyIndicesResult) => {
            $scope.dailyIndicesMetadata = result.DailyIndicesMetadata;
            console.log(result);
        });
        $scope.captureOriginal = (dailyIndexId: string) => {
            client.CaptureDailyIndex({
                ArticleSourceId: articleSourceId,
                DailyIndexId: dailyIndexId
            }).then((result: any) => {
                console.log(result);
            });
        };
        client.GetArticlesIndexStatus({ ArticleSourceId: articleSourceId })
            .then(function (result: Dolphin.Client.Models.GetArticlesIndexStatusResult) {
            $scope.indexStatus = result.Intervals;
        });
        $scope.importArticlesIndex = function (startTs: string, endTs: string) {
            client.ImportArticlesIndex({
                ArticleSourceId: articleSourceId,
                StartTimestamp: startTs,
                EndTimestamp: endTs
            }).then(function (result: Dolphin.Client.Models.ImportArticlesIndexResult) {
                console.log(result);
            });
        };
    }]);