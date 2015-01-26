(function () {
    'use strict';

    var app = angular.module('hydra', ['ngRoute', 'krakenClient']);

    app.factory('ArticleSources', function () {
        var mem = {};

        return {
            set: function (key, value) {
                mem[key] = value;
            },
            get: function (key) {
                return mem[key];
            }
        };
    });

    app.controller('MainController', function (ServiceConfig, $scope, KrakenService) {
        $scope.GooglePlusClientId = ServiceConfig.GooglePlusClientId;
        $scope.signinStatus = 'Unknown';
        $scope.handleGoogleSigninAuthResult = function (authResult) {
            console.log(authResult);
            if (authResult.status.signed_in) {
                KrakenService.setAccessToken(authResult.token_type, authResult.access_token);
                $scope.$broadcast("Authenticated");
                $scope.signinStatus = 'SignedIn';
            } else {
                $scope.signinStatus = 'SignedOut';
            }
            console.log($scope.signinStatus);
        };

        $scope.googleSignOut = function () {
            KrakenService.setAccessToken(null, null);
            $scope.signinStatus = 'SignedOut';
            gapi.auth.signOut();
        };

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
                }).when('/article/:article_source_id/:archive_bucket/:article_id', {
                    templateUrl: 'views/article.html',
                    controller: 'ArticleController'
                }).when('/status', {
                    templateUrl: 'views/status.html',
                    controller: 'StatusController'
                });
        }]);
})();