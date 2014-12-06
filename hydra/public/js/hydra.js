(function () {
    'use strict';

    var app = angular.module('hydra', ['ngRoute', 'krakenClient']);
    app.controller('MainController', function () {
    });

    // configure route
    app.config(['$locationProvider', '$routeProvider',
        function ($locationProvider, $routeProvider) {
            $locationProvider.html5Mode(true);
            $routeProvider.
                when('/', {
                    templateUrl: 'views/_article_sources.html',
                    controller: 'ArticleSourcesController'
                }).when('/article_source/:article_source_id', {
                    templateUrl: 'views/_article_source.html',
                    controller: 'ArticleSourceController'
                }).when('/status', {
                    templateUrl: 'views/_status.html',
                    controller: 'StatusController'
                });
        }]);
})();