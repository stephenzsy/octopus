var util = require('util');
var GenericHandler = require('./generic_handler');
var Kraken = require('../../../model/gen-nodejs/kraken_types');

var ArticleSources = require('../article_sources');

(function () {
    "use strict";

    function GetArticleSource() {
        GenericHandler.call(this);
    }

    util.inherits(GetArticleSource, GenericHandler);

    GetArticleSource.prototype.getMethodName = function () {
        return 'GetArticleSource';
    };

    GetArticleSource.prototype.enact = function (/*GetArticleSourceRequest*/ request) {
        var articleSource = ArticleSources[request.ArticleSourceId];
        if (!articleSource) {
            var e = new Kraken.InvalidArticleSourceIdNotFound();
            e.ArticleSourceId = request.ArticleSourceId;
            e.errorCode = 'InvalidArticleSourceId.NotFound';
            e.message = "Invalid article source ID provided: " + request.ArticleSourceId;
            throw e;
        }
        var result = new Kraken.ArticleSource();
        result.Id = articleSource.getId();
        result.Name = articleSource.getName();
        result.Url = articleSource.getUrl();
        return result;
    };

    var handler = module.exports = new GetArticleSource().handler;
})();
