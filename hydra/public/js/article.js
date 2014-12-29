(function () {
    'use strict';

    angular.module('hydra')
        .controller('ArticleController', function ($scope, $routeParams, KrakenService) {
            $scope.breadcrumb = [];

            console.log($routeParams);

            var request = new Kraken.GenericDocumentRequest({
                ArticleSourceId: $routeParams['article_source_id'],
                DocumentType: Kraken.TYPE_ARTICLE,
                DocumentId: $routeParams['article_id'],
                ArchiveBucket: $routeParams['local_date']
            });

            var x = KrakenService.GetArticle(request, function () {
            }).then(function (data) {
                console.log(data);
            }, function (xhr, status, err) {
                console.dir(xhr);
                console.dir(status);
                console.dir(err);
            });

            $scope.importArticle = function () {
                KrakenService.ImportDocument(request, function () {
                }).then(function (/* Kraken.ImportedDocument */ importedDocument) {
                    $scope.status = null;
                    $scope.$apply();
                });
            };
        });
})();