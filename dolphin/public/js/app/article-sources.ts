///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>
///<reference path="./app.ts"/>
///<reference path="./client.ts"/>
'use strict';

module Dolphin.Controller {
    export interface IArticleSourcesScope extends ng.IScope {
        ArticleSources: Client.Models.ArticleSource[];
        getIndexStatus(articleSourceId: string): void;
    }
}

angular.module('dolphin').controller('ArticleSourcesController', ['$scope', 'DolphinClient', ($scope: Dolphin.Controller.IArticleSourcesScope, client: Dolphin.Client.DolphinClient) => {
    client.ListArticleSources({}).then((result: Dolphin.Client.Models.ListArticleSourcesResult) => {
        $scope.ArticleSources = result.ArticleSources;

        console.log(result);
    });
    $scope.getIndexStatus = function (articleSourceId: string) {
        client.GetArticlesIndexStatus({ ArticleSourceId: articleSourceId })
            .then(function (result: Dolphin.Client.Models.GetArticlesIndexStatusResult) {
            console.log(result);
        });
    };
}]);