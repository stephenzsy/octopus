var util = require('util');
var Kraken = require('kraken-model').Types;

var GenericHandler = require('./generic_handler');
var InputValidators = require('./util/input_validators');

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
        var articleSource = InputValidators.validateArticleSourceId(request.ArticleSourceId);

        var result = new Kraken.ArticleSource();
        result.Id = articleSource.getId();
        result.Name = articleSource.getName();
        result.Url = articleSource.getUrl();
        return result;
    };

    var handler = module.exports = new GetArticleSource().handler;
})();
