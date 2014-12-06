(function () {
    'use strict';

    angular.module('hydra')
        .controller('ArticleSourceController', function ($scope, $routeParams, KrakenService) {
            var request = new Kraken.GetArticleSourceRequest();
            request.ArticleSourceId = $routeParams['article_source_id'];
            KrakenService.GetArticleSource(request, function () {
            }).done(function (data) {
                console.log(data);
            }).fail(function (xhr, status, err) {
                console.dir(xhr);
                console.dir(status);
                console.dir(err);
            });
        });
})();