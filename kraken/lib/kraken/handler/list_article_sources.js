var util = require('util');
var Kraken = require('kraken-model').Types;

var GenericHandler = require('./generic_handler');

(function () {
    "use strict";

    function ListArticleSources() {
        GenericHandler.call(this);
    }

    var ARTICLE_SOURCES_LIST = [
        new Kraken.ArticleSource({
            Id: 'businessinsider',
            Name: 'Business Insider',
            Url: 'http://www.businessinsider.com'
        }),
        new Kraken.ArticleSource({
            Id: 'bloomberg',
            Name: 'Bloomberg',
            Url: 'http://www.bloomberg.com'
        })
    ];

    util.inherits(ListArticleSources, GenericHandler);

    ListArticleSources.prototype.getMethodName = function () {
        return 'ListArticleSources';
    };

    ListArticleSources.prototype.enact = function () {
        return ARTICLE_SOURCES_LIST;
    };

    var handler = module.exports = new ListArticleSources().handler;
})();
