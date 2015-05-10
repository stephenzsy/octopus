///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>
///<reference path="./app.ts"/>
///<reference path="./client.ts"/>
'use strict';

angular.module('dolphin').controller('ArticleSourcesController', ['$scope', 'DolphinClient', ($scope:ng.IScope, client:Dolphin.Client.DolphinClient)=> {
    client.ListArticleSources({}).then((result:Dolphin.Client.Models.ListArticleSourcesResult)=> {
        console.log(result);
    });
}]);