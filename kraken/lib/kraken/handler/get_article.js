var util = require('util');
var Kraken = require('kraken-model').Types;
var Q = require('q');

var GenericHandler = require('./generic_handler');
var InputValidators = require("./util/input_validators");

(function () {
    "use strict";

    var awsS3DocumentRepository = require('../document_repository/aws_s3_document_repository');

    function GetArticle() {
        GenericHandler.call(this);
    }

    util.inherits(GetArticle, GenericHandler);

    GetArticle.prototype.getMethodName = function () {
        return 'GetArticle';
    };

    GetArticle.prototype.enact = function (/*Kraken.GenericDocumentRequest*/ request) {
        var validated = InputValidators.validateGenericDocumentRequest(request);
        var articleSource = validated.articleSource;
        return new Kraken.Article();
    };

    GetArticle.prototype.isAsync = false;

    var handler = module.exports = new GetArticle();
})();
