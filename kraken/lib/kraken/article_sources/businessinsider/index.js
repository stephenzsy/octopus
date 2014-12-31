var util = require('util');
var moment = require('moment-timezone');

var Kraken = require('kraken-model').Types;

var ArticleSource = require('../article_source');
var DocumentParser = require('../../parser/document_parser');

(function () {
    "use strict";

    function BusinessInsider() {
        ArticleSource.call(this);
    }

    util.inherits(BusinessInsider, ArticleSource);

    BusinessInsider.prototype.getId = function () {
        return 'businessinsider';
    };
    BusinessInsider.prototype.getName = function () {
        return 'Business Insider';
    };
    BusinessInsider.prototype.getUrl = function () {
        return 'http://www.businessinsider.com';
    };
    BusinessInsider.prototype.getTimezone = function () {
        return 'America/New_York';
    };

    /**
     * @param date Moment.js local date
     */
    BusinessInsider.prototype.getArchiveDailyIndexUrlForLocalDate = function (date) {
        return 'http://www.businessinsider.com/archives?date=' + date.format('YYYY-MM-DD');
    };

    BusinessInsider.prototype.getArchiveDailyIndexUrlForId = function (id) {
        return 'http://www.businessinsider.com/archives?date=' + id;
    };

    BusinessInsider.prototype.getArticleUrlForId = function (articleId) {
        return 'http://www.businessinsider.com/' + articleId;
    };

    BusinessInsider.prototype.getArticleIdForUrl = function (url) {
        return url.substr('http://www.businessinsider.com/'.length);
    };

    BusinessInsider.prototype.getLocalDateForArchiveDailyIndexId = function (id) {
        return moment.tz(id, this.getTimezone()).format();
    };

    var archiveDailyIndexParser = new DocumentParser(require('./daily_index_model.json'));

    BusinessInsider.prototype.getArchiveDailyIndexParser = function () {
        return archiveDailyIndexParser;
    };

    function stripLeadingSlashes(str) {
        return str.replace(/^\/*/, '');
    }

    BusinessInsider.prototype.toListOfArchiveDailyIndexEntries = function (parsed) {
        var baseUrl = this.getUrl();
        return parsed.map(function (element) {
            return new Kraken.ArchiveDailyIndexEntry({
                ArticleId: stripLeadingSlashes(element.link),
                Url: baseUrl + element.link,
                Name: element.text
            });
        });
    };

    module.exports = BusinessInsider;
})();