(function () {
    'use strict';

    var app = angular.module('hydra', ['ngRoute', 'krakenClient']);

    app.directive('hydraBreadcrumb', function () {
        return {
            restrict: 'A',
            scope: {
                hydraBreadcrumb: '='
            },
            templateUrl: '/views/partials/_breadcrumb.html'
        };
    });

    app.controller('MainController', function () {
    });

    // configure route
    app.config(['$locationProvider', '$routeProvider',
        function ($locationProvider, $routeProvider) {
            $locationProvider.html5Mode(true);
            $routeProvider.
                when('/', {
                    templateUrl: 'views/article_sources.html',
                    controller: 'ArticleSourcesController'
                }).when('/article_source/:article_source_id', {
                    templateUrl: 'views/article_source.html',
                    controller: 'ArticleSourceController'
                }).when('/daily_index/:article_source_id/:daily_index_id', {
                    templateUrl: 'views/daily_index.html',
                    controller: 'DailyIndexController'
                }).when('/article/:article_source_id/:local_date/:article_id', {
                    templateUrl: 'views/article.html',
                    controller: 'ArticleController'
                }).when('/status', {
                    templateUrl: 'views/status.html',
                    controller: 'StatusController'
                });
        }]);
})();