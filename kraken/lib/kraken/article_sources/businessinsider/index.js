var util = require('util');

var ArticleSource = require('../article_source');

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
        return 'http://businessinsider.com/archives?date=' + date.format('YYYY-MM-DD');
    };


    module.exports = BusinessInsider;
})();