///<reference path="../../../scripts/typings/aws-sdk/aws-sdk.d.ts"/>
///<reference path="../../../scripts/typings/validator/validator.d.ts"/>
///<reference path="../../../scripts/typings/q/Q.d.ts"/>
import AWS = require('aws-sdk');
import validator = require('validator');
import Q = require('q');

import DocumentStorage = require('./document-storage');
import CapturedDocument = require('../../models/captured-document');
import ConfigurationManager = require('../../config/configuration-manager');
import InternalException = require('../../../lib/events/internal-exception');

'use strict';

/**
 * Document storage using both AWS S3, and DynamoDB
 */
class AwsDocumentStorage implements DocumentStorage {

    static get engineVersion():string {
        return '2015-05-13';
    }

    private s3:AWS.S3;
    private bucket:string;

    constructor() {
        this.s3 = new AWS.S3({
            credentials: ConfigurationManager.getAwsCredentialsProvider(),
            signatureVersion: 'v4',
            region: ConfigurationManager.defaultAwsRegion
        });
        this.bucket = ConfigurationManager.documentS3Bucket;
    }

    storeCapturedDocumentAsync(doc:CapturedDocument):Q.Promise<any> {
        var _this:AwsDocumentStorage = this;
        if (!doc.validateFields()) {
            throw new InternalException('InvalidCapturedDocument', 'Validation faild for captured document');
        }
        // formulate s3 key
        var documentKey = doc.ArticleSourceId + "/" + doc.ArchiveBucket + "/" + doc.DocumentId;
        var deferred:Q.Deferred<AWS.Models.S3.PutObjectResult> = Q.defer<AWS.Models.S3.PutObjectResult>();
        this.s3.putObject({
            Bucket: this.bucket,
            Key: documentKey,
            ContentType: 'text/plain',
            Body: doc.Content,
            Metadata: {
                "capture-timestamp": doc.CaptureTimestamp,
                "original-url": doc.OriginalUrl
            }
        }, (err:any, data:AWS.Models.S3.PutObjectResult):void => {
            console.dir(err);
            console.dir(data);
            if (err) {
                deferred.reject(err);
            }
            deferred.resolve(data);
            console.log(_this.s3.getSignedUrl('getObject', {Bucket: this.bucket, Key: documentKey}));
        });
        return deferred.promise;
    }

}

export = AwsDocumentStorage;
