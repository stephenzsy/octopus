(function () {
    'use strict';

    angular.module('hydra')
        .controller('ArticleController', function ($scope, $routeParams, KrakenService) {
            function pageInit() {
                var request = new Kraken.GenericDocumentRequest({
                    ArticleSourceId: $routeParams.article_source_id,
                    DocumentType: Kraken.TYPE_ARTICLE,
                    DocumentId: $routeParams.article_id,
                    ArchiveBucket: $routeParams.archive_bucket
                });

                function handleArticle(article) {
                    article.Content = JSON.parse(article.Content);
                    $scope.Article = article;
                    console.log(article);
                }

                function importAndParse() {
                    return KrakenService.ImportDocument(request)
                        .then(function () {
                            return KrakenService.ParseArticle(request);
                        }).then(handleArticle);
                }


                KrakenService.GetArticle(request)
                    .then(handleArticle, function (err) {
                        if (err instanceof Kraken.ValidationError && err.ErrorCode === Kraken.ERROR_CODE_INVALID_DOCUMENT_ID_NOT_PARSED) {
                            $scope.status = 'NotParsed';

                            // check if it is imported
                            return KrakenService.ParseArticle(request)
                                .then(handleArticle, function (err) {
                                    // not imported, import
                                    if (err instanceof Kraken.ValidationError && err.ErrorCode === Kraken.ERROR_CODE_INVALID_DOCUMENT_ID_NOT_IMPORTED) {
                                        $scope.status = 'NotImported';
                                        return importAndParse();
                                    }
                                    throw err;
                                });
                        }
                        throw err;
                    });
            }

            if (KrakenService.isAuthConfigured()) {
                pageInit();
            }
            $scope.$on('Authenticated', pageInit);
        });

})();