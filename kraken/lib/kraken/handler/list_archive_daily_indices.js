var util = require('util');

var moment = require('moment-timezone');

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
            latestLocalDate = moment(request.LatestLocalDate).tz(articleSource.getTimezone());
        } else {
            latestLocalDate = moment().tz(articleSource.getTimezone());
        }
        latestLocalDate = latestLocalDate.startOf('day');

        var results = [];
        if (request.Limit > 50 || request.Limit < 1) {
            throw new Kraken.ValidationError("Request not in range between 1 and 50 ")
        }
        for (var i = 0; i < request.Limit; ++i) {
            var dailyIndex = new Kraken.ArchiveDailyIndex();
            dailyIndex.ArticleSourceId = request.ArticleSourceId;
            dailyIndex.LocalDate = latestLocalDate.clone().subtract(i, 'days').format();
            results.push(dailyIndex);
        }
        return results;
    };

    var handler = module.exports = new ListArchiveDailyIndices().handler;
})();
