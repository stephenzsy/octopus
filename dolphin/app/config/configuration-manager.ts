///<reference path="../../scripts/typings/aws-sdk/aws-sdk.d.ts"/>
import AWS = require('aws-sdk');

class ConfigurationManager {

    private static awsConfig: {
        gcloud: {
            projectId:string;
            documentBucket: string;
        };
        credentials: {
            profile?: string
        };
        s3: {
            bucket: { document: string }
        };
        dynamodb: {
            table: {
                articlesIndexMetadata: string;
                articles: string
            };
        };
        defaultRegion: string
    } = require('./aws-config.json');

    static getAwsCredentialsProvider(): AWS.Credentials {
        if (ConfigurationManager.awsConfig.credentials.profile) {
            return new AWS.SharedIniFileCredentials({ profile: ConfigurationManager.awsConfig.credentials.profile });
        }
        return null;
    }

    static get defaultAwsRegion(): string {
        return ConfigurationManager.awsConfig.defaultRegion;
    }

    static get documentS3Bucket(): string {
        return ConfigurationManager.awsConfig.s3.bucket.document;
    }

    static get articlesIndexMetadataDynamodbTableName(): string {
        return ConfigurationManager.awsConfig.dynamodb.table.articlesIndexMetadata;
    }

    static get articlesDynamodbTableName(): string {
        return ConfigurationManager.awsConfig.dynamodb.table.articles;
    }

    static get gcloudProjectId(): string {
        return ConfigurationManager.awsConfig.gcloud.projectId;
    }

    static get documentGcloudBucket(): string {
        return ConfigurationManager.awsConfig.gcloud.documentBucket;
    }
}

export = ConfigurationManager;