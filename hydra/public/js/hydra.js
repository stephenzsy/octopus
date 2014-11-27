(function () {
    'use strict';

    var app = angular.module('hydra', ['ngRoute', 'krakenClient']);
    app.controller('MainController', function () {
        console.log("MainController Ready")
    });

    // configure route
    app.config(['$locationProvider', '$routeProvider',
        function ($locationProvider, $routeProvider) {
            $locationProvider.html5Mode(true);
            $routeProvider.
                when('/', {
                    templateUrl: 'views/_article_sources.html',
                    controller: 'ArticleSourcesController'
                }).when('/status', {
                    templateUrl: 'views/_status.html',
                    controller: 'StatusController'
                });
        }]);
})();