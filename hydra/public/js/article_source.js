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
            var x = KrakenService.GetArticleSource(request, function () {
            }).then(function (data) {
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
                var listArchiveDailyIndicesRequest = new Kraken.ListArchiveDailyIndicesRequest();
                listArchiveDailyIndicesRequest.ArticleSourceId = data.Id;
                return KrakenService.ListArchiveDailyIndices(listArchiveDailyIndicesRequest);
            }, function (xhr, status, err) {
                console.dir(xhr);
                console.dir(status);
                console.dir(err);
            }).then(function (data) {
                $scope.dailyIndices = data;
                $scope.$apply();
            }, function (xhr, status, err) {
                console.dir(xhr);
                console.dir(status);
                console.dir(err);
            });
        });
})();