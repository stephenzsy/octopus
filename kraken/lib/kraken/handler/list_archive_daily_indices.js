var util = require('util');
var GenericHandler = require('./generic_handler');
var Kraken = require('../../../model/gen-nodejs/kraken_types');

var ArticleSources = require('../article_sources');

(function () {
    "use strict";

    function ListArchiveDailyIndices() {
        GenericHandler.call(this);
    }

    util.inherits(ListArchiveDailyIndices, GenericHandler);

    ListArchiveDailyIndices.prototype.getMethodName = function () {
        return 'ListArchiveDailyIndices';
    };

    ListArchiveDailyIndices.prototype.enact = function (/*ListArchiveDailyIndicesRequest*/ request) {
        var articleSource = ArticleSources[request.ArticleSourceId];
        if (!articleSource) {
            var e = new Kraken.InvalidArticleSourceIdNotFound();
            e.ArticleSourceId = request.ArticleSourceId;
            e.errorCode = 'InvalidArticleSourceId.NotFound';
            e.message = "Invalid article source ID provided: " + request.ArticleSourceId;
            throw e;
        }

        var latestLocalDate = null;
        if (request.LatestLocalDate) {
            latestLocalDate = new Date(request.LatestLocalDate)
        } else {
            latestLocalDate = new Date();
        }
        console.log(latestLocalDate);
        var result = new Kraken.ArchiveDailyIndex();
        return [result];
    };

    var handler = module.exports = new ListArchiveDailyIndices().handler;
})();
