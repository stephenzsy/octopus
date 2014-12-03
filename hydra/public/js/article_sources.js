(function () {
    'use strict';

    angular.module('hydra')
        .controller('ArticleSourcesController', function ($scope, KrakenService) {
            KrakenService.ListArticleSources(function () {
            }).done(function (data) {
                $scope.articleSources = data;
                $scope.$apply();
            }).fail(function (xhr, status, err) {
                console.error(xhr);
                console.error(status);
                console.error(err);
            });
        });
})();