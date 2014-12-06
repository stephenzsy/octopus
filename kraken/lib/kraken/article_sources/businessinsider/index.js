var util = require('util');

var ArticleSource = require('../article_source');

(function () {
    "use strict";

    function BusinessInsider() {
        ArticleSource.call(this);
    }

    util.inherits(BusinessInsider, ArticleSource);

    BusinessInsider.prototype.getId = function () {
        return 'businessinsider'
    };
    BusinessInsider.prototype.getName = function () {
        return 'Buainess Insider'
    };
    BusinessInsider.prototype.getUrl = function () {
        return 'http://www.businessinsider.com'
    };

    module.exports = BusinessInsider;
})();