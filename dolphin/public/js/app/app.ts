///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>

'use strict';

module Dolphin.Client {

    export interface ArticleSource {
        Id:string;
        Name:string;
        Url:string;
    }

    export interface ListArticleSourcesResult {
        ArticleSources: ArticleSource[];
    }

    export class DolphinClient {
        private $http:angular.IHttpService;
        private $q:angular.IQService;

        constructor($http:angular.IHttpService, $q:angular.IQService) {
            this.$http = $http;
            this.$q = $q;
        }

        ListArticleSources():ng.IPromise<ListArticleSourcesResult> {
            var deferred:ng.IDeferred<ListArticleSourcesResult> = this.$q.defer();
            this.$http.post('/api', {}, {
                headers: {
                    'x-dolphin-method': 'ListArticleSources'
                }
            }).success((data:ListArticleSourcesResult, status:number, headers:ng.IHttpHeadersGetter, config:ng.IRequestConfig):void=> {
                deferred.resolve(data);
            }).error((data:any, status:number, headers:ng.IHttpHeadersGetter, config:ng.IRequestConfig):void=> {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }
}

angular.module('dolphin', ['ngRoute']).controller('MainController', ()=> {
}).factory('DolphinClient', ['$http', '$q', ($http:angular.IHttpService, $q:angular.IQService)=> {
    return new Dolphin.Client.DolphinClient($http, $q);
}]);
