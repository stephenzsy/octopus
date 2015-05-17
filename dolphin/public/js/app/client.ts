///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>
///<reference path="./app.ts"/>

'use strict';

module Dolphin.Client {
    export interface Request {

    }

    export interface Result {
        RequestId: string;
    }

    export module Models {
        export interface ArticleSource {
            Id: string;
            Name: string;
            Url: string;
        }

        export interface DailyIndexMetadata {
            Id: string;
            LocalDate: string;
            Url: string;
        }

        export interface ListArticleSourcesRequest extends Request {
        }

        export interface ListArticleSourcesResult extends Result {
            ArticleSources: ArticleSource[];
        }

        export interface ListDailyIndicesRequest extends Request {
            ArticleSourceId: string;
        }

        export interface ListDailyIndicesResult extends Result {
            DailyIndicesMetadata: DailyIndexMetadata[];
        }

        export interface CaptureDailyIndexRequest extends Request {
            ArticleSourceId: string;
            DailyIndexId: string;
        }

        export interface GenericArticlesRequest extends Request {
            ArticleSourceId: string;
            StartTimestamp?: string;
            EndTimestamp?: string;
            Limit?: number;
        }

        export interface GetArticlesIndexStatusResult extends Result {
            Start?: string;
            End?: string;
            Status?: string;
        }
    }

    export class DolphinClient {
        private $http: angular.IHttpService;
        private $q: angular.IQService;

        constructor($http: angular.IHttpService, $q: angular.IQService) {
            this.$http = $http;
            this.$q = $q;
        }

        private makeRequest<T extends Request, U extends Result>(method: string, request: T): ng.IPromise<U> {
            var deferred: ng.IDeferred<U> = this.$q.defer();
            this.$http.post('/api', request, {
                headers: {
                    'x-dolphin-method': method
                }
            }).success((data: U, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig): void=> {
                deferred.resolve(data);
            }).error((err: any, status: number, headers: ng.IHttpHeadersGetter, config: ng.IRequestConfig): void=> {
                deferred.reject(err);
            });
            return deferred.promise;
        }

        ListArticleSources(request: Models.ListArticleSourcesRequest): ng.IPromise<Models.ListArticleSourcesResult> {
            return this.makeRequest('ListArticleSources', request);
        }

        ListDailyIndices(request: Models.ListDailyIndicesRequest): ng.IPromise<Models.ListDailyIndicesResult> {
            return this.makeRequest('ListDailyIndices', request);
        }

        CaptureDailyIndex(request: Models.CaptureDailyIndexRequest): ng.IPromise<any> {
            return this.makeRequest('CaptureDailyIndex', request);
        }

        GetArticlesIndexStatus(request: Models.GenericArticlesRequest): ng.IPromise<Models.GetArticlesIndexStatusResult> {
            return this.makeRequest('GetArticlesIndexStatus', request);
        }
    }
}


angular.module('dolphin').factory('DolphinClient', ['$http', '$q', ($http: angular.IHttpService, $q: angular.IQService) => {
    return new Dolphin.Client.DolphinClient($http, $q);
}]);
