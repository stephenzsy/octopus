///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>
///<reference path="./app.ts"/>

'use strict';

module Dolphin.Client {

    export module Models {
        export interface ArticleSource {
            Id: string;
            Name: string;
            Url: string;
        }

        export interface ListArticleSourcesRequest {
        }

        export interface ListArticleSourcesResult {
            ArticleSources: ArticleSource[];
        }
    }

    export class DolphinClient {
        private $http:angular.IHttpService;
        private $q:angular.IQService;

        constructor($http:angular.IHttpService, $q:angular.IQService) {
            this.$http = $http;
            this.$q = $q;
        }

        ListArticleSources(request:Models.ListArticleSourcesRequest):ng.IPromise<Models.ListArticleSourcesResult> {
            var deferred:ng.IDeferred<Models.ListArticleSourcesResult> = this.$q.defer();
            this.$http.post('/api', {}, {
                headers: {
                    'x-dolphin-method': 'ListArticleSources'
                }
            }).success((data:Models.ListArticleSourcesResult, status:number, headers:ng.IHttpHeadersGetter, config:ng.IRequestConfig):void=> {
                deferred.resolve(data);
            }).error((data:any, status:number, headers:ng.IHttpHeadersGetter, config:ng.IRequestConfig):void=> {
                deferred.reject(data);
            });
            return deferred.promise;
        }
    }
}


angular.module('dolphin').factory('DolphinClient', ['$http', '$q', ($http:angular.IHttpService, $q:angular.IQService)=> {
    return new Dolphin.Client.DolphinClient($http, $q);
}]);
