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
                ArchiveBucket: $routeParams['archive_bucket']
            });

            var x = KrakenService.GetArticle(request).then(function (/* Kraken.Article */ article) {
                console.log(article)
            }, function (err) {
                if (err instanceof Kraken.ValidationError && err.ErrorCode === Kraken.ERROR_CODE_INVALID_DOCUMENT_ID_NOT_PARSED) {
                    // check if it is imported
                    return KrakenService.ParseArticle(request)
                        .then(function (data) {
                            return data;
                        }, function (err) {
                            // not imported, import
                            if (err instanceof Kraken.ValidationError && err.ErrorCode === Kraken.ERROR_CODE_INVALID_DOCUMENT_ID_NOT_IMPORTED) {
                                $scope.status = 'NotImported';
                                return KrakenService.ImportDocument(request)
                                    .then(function () {
                                        return KrakenService.ParseARticle(request);
                                    });
                            }
                            throw err;
                        }).then(function (article) {
                            console.log(article);
                        });
                }
            });
        });
})();