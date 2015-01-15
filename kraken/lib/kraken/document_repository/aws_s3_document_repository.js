var util = require("util");

var Config = require('../../../config');
var Q = require('q');
var AWS = require('aws-sdk');
var Kraken = require('kraken-model').Types;

(function () {
    "use strict";

    function AwsS3DocumentRepository() {
    }

    var credentials = new AWS.SharedIniFileCredentials({profile: 'kraken'});
    AWS.config.credentials = credentials;
    var s3 = new AWS.S3({region: 'us-west-2'});
    var bucketName = Config.aws.s3.bucket;

    function getS3KeyForGenericDocumentRequest(/* Kraken.GenericDocumentRequest */ request, format) {
        if (request.DocumentType === Kraken.TYPE_DAILY_INDEX) {
            return request.ArticleSourceId + ":daily_index:" + format + "/" + request.DocumentId.replace(/-/g, "/");
        } else if (request.DocumentType === Kraken.TYPE_ARTICLE) {
            var tail = request.ArchiveBucket.replace(/-/g, "/") + "/" + request.DocumentId;
            return request.ArticleSourceId + ":article:" + format + "/" + tail;
        } else {
            throw "Invalid document type: " + request.DocumentType;
        }
    }

    function getS3KeyForImportedDocument(/* Kraken.ImportedDocument */ importedDocument, format) {
        var request = new Kraken.GenericDocumentRequest({
            ArticleSourceId: importedDocument.ArticleSourceId,
            DocumentType: importedDocument.Type,
            DocumentId: importedDocument.Id
        });
        if (importedDocument.Type === Kraken.TYPE_ARTICLE && importedDocument.Metadata['ArchiveBucket']) {
            request.ArchiveBucket = importedDocument.Metadata['ArchiveBucket'];
        }
        return getS3KeyForGenericDocumentRequest(request, format);
    }

    AwsS3DocumentRepository.prototype.getS3KeyForGenericDocumentRequest = getS3KeyForGenericDocumentRequest;
    AwsS3DocumentRepository.prototype.getS3KeyForImportedDocument = getS3KeyForImportedDocument;

    AwsS3DocumentRepository.prototype.storeImportedDocument = function (/* Kraken.ImportedDocument */ importedDocument) {
        var deferred = Q.defer();
        var s3Key = getS3KeyForImportedDocument(importedDocument, 'raw');
        var request = {
            Bucket: bucketName,
            Key: s3Key,
            Body: importedDocument.DocumentContent
        };
        var metadata = {};
        for (var k in importedDocument.Metadata) {
            if (k === 'ContentType') {
                request.ContentType = importedDocument.Metadata[k];
            } else if (k === 'ArchiveBucket') {
                // skip
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

    AwsS3DocumentRepository.prototype.storeParsedDocument = function (genericDocumentRequest, parsed, metadata) {
        var deferred = Q.defer();
        var s3Key = this.getS3KeyForGenericDocumentRequest(genericDocumentRequest, 'json');
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

    AwsS3DocumentRepository.prototype.getParsedDocument = function (genericDocumentRequest) {
        var deferred = Q.defer();
        var s3Key = this.getS3KeyForGenericDocumentRequest(genericDocumentRequest, 'json');
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

    AwsS3DocumentRepository.prototype.getImportedDocumentMetadata = function (genericDocumentRequest) {
        var deferred = Q.defer();
        var s3Key = this.getS3KeyForGenericDocumentRequest(genericDocumentRequest, 'raw');
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

    AwsS3DocumentRepository.prototype.getImportedDocument = function (genericDocumentRequest) {
        var deferred = Q.defer();
        var s3Key = this.getS3KeyForGenericDocumentRequest(genericDocumentRequest, 'raw');
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

    AwsS3DocumentRepository.prototype.class = AwsS3DocumentRepository;
    module.exports = new AwsS3DocumentRepository();

})();
