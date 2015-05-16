import AWS = require('aws-sdk');
import Q = require('q');

import ArticlesIndex = require('./articles-index');
import IndexInterval = require('./articles-index-interval');
import ConfigurationManager = require('../config/configuration-manager');
import ArticleSource = require('../models/article-source');

class AwsDynamodbArticlesIndex implements ArticlesIndex {
    private dynamodb: AWS.DynamoDB;
    private indexMetadataTableName: string;

    constructor(config: ConfigurationManager) {
        this.dynamodb = new AWS.DynamoDB({
            credentials: ConfigurationManager.getAwsCredentialsProvider(),
            region: ConfigurationManager.defaultAwsRegion
        });
        this.indexMetadataTableName = ConfigurationManager.articlesIndexMetadataDynamodbTableName;
    }

    fetchIntervalsAsync(articleSource: ArticleSource, offset: moment.Moment /*offset inclusive*/, backwards: boolean, duration: moment.Duration): IndexInterval[] {
        var result: IndexInterval[] = [];
        var hashKey = articleSource.Id + ':articles';
        var rangeKey = offset.utc().toISOString();
        this.dynamodb.query({
            TableName: this.indexMetadataTableName
        }, function (err, data) {
                console.error(err);
            });
        return result;
    }
}
