///<reference path="../../scripts/typings/aws-sdk/aws-sdk.d.ts"/>
import AWS = require('aws-sdk');

class ConfigurationManager {

    private static awsConfig:{
        credentials:{
            profile?:string
        }
        defaultRegion:string
    } = require('./aws-config.json');

    static getAwsCredentialsProvider():AWS.Credentials {
        if (ConfigurationManager.awsConfig.credentials.profile) {
            return new AWS.SharedIniFileCredentials({profile: ConfigurationManager.awsConfig.credentials.profile});
        }
        return null;
    }

    static get defaultAwsRegion():string {
        return ConfigurationManager.awsConfig.defaultRegion;
    }
}

export = ConfigurationManager;