///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>
///<reference path="./app.ts"/>
'use strict';

angular.module('dolphin').controller('ArticleSourcesController', ['DolphinClient', (client:Dolphin.Client.DolphinClient)=>{
    console.log(client);
    client.ListArticleSources().then((result:Dolphin.Client.ListArticleSourcesResult)=>{
        console.log(result);
    });
}]);