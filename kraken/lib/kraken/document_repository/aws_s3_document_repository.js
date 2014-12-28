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

    var credentials = new AWS.SharedIniFileCredentials({profile: 'kraken'});
    AWS.config.credentials = credentials;
    var s3 = new AWS.S3({region: 'us-west-2'});
    var bucketName = Config.aws.s3.bucket;

    function getS3Key(articleSourceId, documentType, documentId, format) {
        var content_part = null;
        var tail = null;
        if (documentType === Kraken.TYPE_DAILY_INDEX) {
            content_part = "daily_index";
            tail = documentId.replace(/-/g, "/");
        } else {
            throw "Invalid imported document type: " + importedDocument.Type;
        }
        return articleSourceId + ":" + content_part + ":" + format + "/" + tail;
    }

    function getS3KeyForImportedDocument(/* Kraken.ImportedDocument */ importedDocument) {
        return getS3Key(importedDocument.ArticleSourceId, importedDocument.Type, importedDocument.Id, "raw");
    }

    AwsS3DocumentRepository.prototype.storeImportedDocument = function (/* Kraken.ImportedDocument */ importedDocument) {
        var deferred = Q.defer();
        var s3Key = getS3KeyForImportedDocument(importedDocument);
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
        metadata['source-url'] = importedDocument.SourceUrl;
        metadata['import-timestamp'] = importedDocument.ImportTimestamp;
        request.Metadata = metadata;
        s3.putObject(request, function (err, data) {
            if (err) {
                console.error(err);
                deferred.reject(err);
            } else {
                deferred.resolve(importedDocument);
            }
        });
        return deferred.promise;
    };

    AwsS3DocumentRepository.prototype.storeParsedDocument = function (articleSourceId, documentType, documentId, parsed, metadata) {
        var deferred = Q.defer();
        var s3Key = getS3Key(articleSourceId, documentType, documentId, "json");
        var request = {
            Bucket: bucketName,
            Key: s3Key,
            Body: JSON.stringify(parsed),
            ContentType: "application/json",
            Metadata: {
                "import-timestamp": metadata.ImportTimestamp,
                "source-url": metadata.SourceUrl,
                "parse-timestamp": metadata.ParseTimestamp,
                "parser-model-version": metadata.ParserModelVersion
            }
        };
        s3.putObject(request, function (err, data) {
            if (err) {
                console.error(err);
                deferred.reject(err);
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    };

    AwsS3DocumentRepository.prototype.getParsedDocument = function (articleSourceId, documentType, documentId) {
        var deferred = Q.defer();
        var s3Key = getS3Key(articleSourceId, documentType, documentId, "json");
        var request = {
            Bucket: bucketName,
            Key: s3Key
        };
        s3.getObject(request, function (err, data) {
            if (err) {
                if (err.code === 'NoSuchKey') {
                    deferred.resolve(null);
                } else {
                    console.error(err);
                    deferred.reject(err);
                }
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    };

    AwsS3DocumentRepository.prototype.getImportedDocumentMetadata = function (articleSourceId, documentType, documentId) {
        var deferred = Q.defer();
        var s3Key = getS3Key(articleSourceId, documentType, documentId, "raw");
        var request = {
            Bucket: bucketName,
            Key: s3Key
        };
        s3.headObject(request, function (err, data) {
            if (err) {
                if (err.code === 'NotFound') {
                    deferred.resolve(null);
                } else {
                    console.error(err);
                    deferred.reject(err);
                }
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    };

    AwsS3DocumentRepository.prototype.getImportedDocument = function (articleSourceId, documentType, documentId) {
        var deferred = Q.defer();
        var s3Key = getS3Key(articleSourceId, documentType, documentId, "raw");
        var request = {
            Bucket: bucketName,
            Key: s3Key
        };
        s3.getObject(request, function (err, data) {
            if (err) {
                if (err.code === 'NoSuchKey') {
                    deferred.resolve(null);
                } else {
                    console.error(err);
                    deferred.reject(err);
                }
            } else {
                deferred.resolve(data);
            }
        });
        return deferred.promise;
    };

    module.exports = new AwsS3DocumentRepository();

})();
