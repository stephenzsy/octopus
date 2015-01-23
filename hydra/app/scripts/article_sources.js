(function () {
    'use strict';

    angular.module('hydra')
        .controller('ArticleSourcesController', function ($scope, KrakenService) {
            KrakenService.ListArticleSources()
                .then(function (articleSources) {
                    $scope.articleSources = articleSources;
                });
        });
})();