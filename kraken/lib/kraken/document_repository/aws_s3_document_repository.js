var util = require("util");

var Config = require('../../../config');
var Q = require('q');
var AWS = require('aws-sdk');
var Kraken = require('kraken-model').Types;

var DocumentRepository = require('./document_repository');

(function () {
    "use strict";

    function AwsS3DocumentRepository() {
        DocumentRepository.call(this);
    }

    util.inherits(AwsS3DocumentRepository, DocumentRepository);

    module.exports = AwsS3DocumentRepository;

    var credentials = new AWS.SharedIniFileCredentials({profile: 'kraken'});
    AWS.config.credentials = credentials;
    var s3 = new AWS.S3({region: 'us-west-2'});
    var bucketName = Config.aws.s3.bucket;

    function getS3Key(/* Kraken.ImportedDocument */ importedDocument) {
        var content_part = null;
        var tail = null;
        if (importedDocument.Type === Kraken.TYPE_DAILY_INDEX) {
            content_part = "daily_index";
            tail = importedDocument.Id.replace(/-/g, "/");
        } else {
            throw "Invalid imported document type: " + importedDocument.Type;
        }
        return importedDocument.ArticleSourceId + ":" + content_part + ":raw/" + tail;
    }

    AwsS3DocumentRepository.prototype.storeImportedDocument = function (/* Kraken.ImportedDocument */ importedDocument) {
        var deferred = Q.defer();
        var s3Key = getS3Key(importedDocument);
        var request = {
            Bucket: bucketName,
            Key: s3Key,
            Body: importedDocument.DocumentContent
        };
        var metadata = {};
        for (var k in importedDocument.Metadata) {
            if (k == 'ContentType') {
                request.ContentType = importedDocument.Metadata[k];
            } else {
                metadata[k] = importedDocument.Metadata[k];
            }
        }
        metadata['ImportDateTime'] = importedDocument.ImportDateTime;
        request.Metadata = metadata;
        s3.putObject(request, function (err, data) {
            if (err) {
                console.error(err);
                deferred.reject(err);
            }
            else deferred.resolve(importedDocument);
        });
        return deferred.promise;
    };

})();
