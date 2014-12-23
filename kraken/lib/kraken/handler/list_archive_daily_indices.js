var util = require('util');

var moment = require('moment-timezone');
var Kraken = require('kraken-model').Types;

var GenericHandler = require('./generic_handler');
var InputValidators = require('./util/input_validators');

(function () {
    "use strict";

    function ListArchiveDailyIndices() {
        GenericHandler.call(this);
    }

    util.inherits(ListArchiveDailyIndices, GenericHandler);

    ListArchiveDailyIndices.prototype.getMethodName = function () {
        return 'ListArchiveDailyIndices';
    };

    ListArchiveDailyIndices.prototype.enact = function (/*Kraken.ListArchiveDailyIndicesRequest*/ request) {
        var articleSource = InputValidators.validateArticleSourceId(request.ArticleSourceId);

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
            var d = latestLocalDate.clone().subtract(i, 'days');
            var dailyIndex = new Kraken.ArchiveDailyIndex();
            dailyIndex.ArticleSourceId = articleSource.getId();
            dailyIndex.ArchiveDailyIndexId = d.format("YYYY-MM-DD");
            dailyIndex.LocalDate = d.format();
            dailyIndex.Status = Kraken.STATUS_UNKNOWN;
            dailyIndex.SourceUrl = articleSource.getArchiveDailyIndexUrlForLocalDate(d);
            results.push(dailyIndex);
        }
        return results;
    };

    var handler = module.exports = new ListArchiveDailyIndices().handler;
})();
