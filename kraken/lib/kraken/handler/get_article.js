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

        return awsS3DocumentRepository.getParsedDocument(request).then(function (s3Response) {
            if (s3Response == null) {
                throw new Kraken.ValidationError({
                    ErrorCode: Kraken.ERROR_CODE_INVALID_DOCUMENT_ID_NOT_PARSED,
                    Message: "Document not parsed: " + request.ArticleSourceId + "," + request.DocumentType + "," + request.DocumentId + "," + request.ArchiveBucket
                });
            }
            console.log(s3Response);
            return new Kraken.Article();
        }, function (err) {
            throw err;
        });

    };

    GetArticle.prototype.isAsync = true;

    var handler = module.exports = new GetArticle();
})();
