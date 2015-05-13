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
    }

    export interface IArticleSourceRouteParams extends ng.route.IRouteParamsService {
        article_source_id: string;
    }
}

angular.module('dolphin').controller('ArticleSourceController', ['$scope', 'DolphinClient', '$routeParams',
    ($scope: Dolphin.Controller.IArticleSourceScope, client: Dolphin.Client.DolphinClient, $routeParams: Dolphin.Controller.IArticleSourceRouteParams) => {
        $scope.articleSourceId = $routeParams.article_source_id;
        client.ListDailyIndices({ ArticleSourceId: $routeParams.article_source_id }).then((result: Dolphin.Client.Models.ListDailyIndicesResult) => {
            $scope.dailyIndicesMetadata = result.DailyIndicesMetadata;
            console.log(result);
        });
        $scope.captureOriginal = (dailyIndexId: string) => {
            client.CaptureDailyIndex({
                ArticleSourceId: $scope.articleSourceId,
                DailyIndexId: dailyIndexId
            }).then((result: any) => {
                console.log(result);
            });
        };
    }]);