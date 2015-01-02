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
        return url.substring('http://www.bloomberg.com/'.length, url.length - ".html".length);
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
        var entries = [];
        parsed.forEach(function (element) {
            var m = /^\/(\w+)\/([\d-]+)\/([^\/]*)\.html$/g.exec(element.link);
            if (m == null) {
                console.error(element);
                throw 'WTF';
            }
            if (m[1] === 'news') {
                entries.push(new Kraken.ArchiveDailyIndexEntry({
                    ArticleId: m[3],
                    Url: baseUrl + element.link,
                    Name: element.text,
                    ArchiveBucket: m[2]
                }));
            } else {
                switch (m[1]) {
                    case 'slideshow':
                        // do nothing as slideshow
                        break;
                    default:
                        console.err("Unrecognized link");
                        throw 'WTF'
                }
            }
        });
        return entries;
    };

    module.exports = Bloomberg;
})();