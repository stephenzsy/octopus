(function () {
    'use strict';

    angular.module('hydra')
        .controller('ArticleSourcesController', function ($scope, KrakenService) {
            function pageInit() {
                KrakenService.ListArticleSources()
                    .then(function (articleSources) {
                        $scope.articleSources = articleSources;
                    });
            }
            if (KrakenService.isAuthConfigured()) {
                pageInit();
            }
            $scope.$on('Authenticated', pageInit);
        });
})();