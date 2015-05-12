///<reference path="../../../scripts/typings/angularjs/angular.d.ts"/>
///<reference path="../../../scripts/typings/angularjs/angular-route.d.ts"/>

'use strict';

angular.module('dolphin').config(['$routeProvider', '$locationProvider',
    ($routeProvider:angular.route.IRouteProvider, $locationProvider:ng.ILocationProvider):any=> {
        $locationProvider.html5Mode(true);
        $routeProvider.when('/', {
            templateUrl: 'views/_article-sources.html',
            controller: 'ArticleSourcesController'
        }).when('/article-sources/:article_source_id', {
            templateUrl: 'views/_article-source.html',
            controller: 'ArticleSourceController'
        });
    }]);
