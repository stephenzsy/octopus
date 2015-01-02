var util = require('util');
var moment = require('moment-timezone');

var Kraken = require('kraken-model').Types;

var ArticleSource = require('../article_source');
var DocumentParser = require('../../parser/document_parser');

(function () {
    "use strict";

    function Bloomberg() {
        ArticleSource.call(this);
    }

    util.inherits(Bloomberg, ArticleSource);

    Bloomberg.prototype.getId = function () {
        return 'bloomberg';
    };
    Bloomberg.prototype.getName = function () {
        return 'Bloomberg';
    };
    Bloomberg.prototype.getUrl = function () {
        return 'http://www.bloomberg.com';
    };
    Bloomberg.prototype.getTimezone = function () {
        return 'America/New_York';
    };

    /**
     * @param date Moment.js local date
     */
    Bloomberg.prototype.getArchiveDailyIndexUrlForLocalDate = function (date) {
        return 'http://www.bloomberg.com/archive/news/' + date.format('YYYY-MM-DD') + '/';
    };

    Bloomberg.prototype.getArchiveDailyIndexUrlForId = function (id) {
        return 'http://www.bloomberg.com/archive/news/' + id + '/';
    };

    Bloomberg.prototype.getArticleUrlForId = function (articleId) {
        return 'http://www.bloomberg.com/' + articleId;
    };

    Bloomberg.prototype.getArticleIdForUrl = function (url) {
        return url.substr('http://www.bloomberg.com/'.length);
    };

    Bloomberg.prototype.getLocalDateForArchiveDailyIndexId = function (id) {
        return moment.tz(id, this.getTimezone()).format();
    };

    var archiveDailyIndexParser = new DocumentParser(require('./daily_index_model.json'));

    Bloomberg.prototype.getArchiveDailyIndexParser = function () {
        return archiveDailyIndexParser;
    };

    function stripLeadingSlashes(str) {
        return str.replace(/^\/*/, '');
    }

    Bloomberg.prototype.toListOfArchiveDailyIndexEntries = function (parsed) {
        var baseUrl = this.getUrl();
        return parsed.map(function (element) {
            return new Kraken.ArchiveDailyIndexEntry({
                ArticleId: stripLeadingSlashes(element.link),
                Url: baseUrl + element.link,
                Name: element.text
            });
        });
    };

    module.exports = Bloomberg;
})();