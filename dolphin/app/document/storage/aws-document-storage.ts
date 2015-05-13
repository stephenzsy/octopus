///<reference path="../../../scripts/typings/aws-sdk/aws-sdk.d.ts"/>
import AWS = require('aws-sdk');

import DocumentStorage = require('./document-storage');
import CapturedDocument = require('../../models/captured-document');
import ConfigurationManager = require('../../config/configuration-manager');

'use strict';

/**
 * Document storage using both AWS S3, and DynamoDB
 */
class AwsDocumentStorage implements DocumentStorage {

    private s3:AWS.S3;

    constructor() {
        this.s3 = new AWS.S3({
            credentials: ConfigurationManager.getAwsCredentialsProvider(),
            signatureVersion: 'v4',
            region: ConfigurationManager.defaultAwsRegion
        });
    }

    storeCapturedDocumentAsync(doc:CapturedDocument) {
        // formulate s3 key
        this.s3.listBuckets({}, (err:any, data:any):void => {
            console.error(err);
            console.log(data);
        });
    }

}

export = AwsDocumentStorage;
