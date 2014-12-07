(function () {
    'use strict';

    angular.module('hydra')
        .controller('ArticleSourceController', function ($scope, $routeParams, KrakenService) {
            $scope.ArticleSource = {
                displayName: '',
                id: $routeParams['article_source_id']
            };
            $scope.breadcrumb = [];

            var request = new Kraken.GetArticleSourceRequest();
            request.ArticleSourceId = $scope.ArticleSource.id;
            KrakenService.GetArticleSource(request, function () {
            }).done(function (data) {
                $scope.ArticleSource.displayName = data.Name;
                $scope.breadcrumb = [
                    {
                        display: $scope.ArticleSource.displayName,
                        active: false
                    }
                ];
                $scope.ArticleSource.id = data.Id;
                $scope.ArticleSource.url = data.Url;
                $scope.$apply();
            }).fail(function (xhr, status, err) {
                console.dir(xhr);
                console.dir(status);
                console.dir(err);
            });
        });
})();