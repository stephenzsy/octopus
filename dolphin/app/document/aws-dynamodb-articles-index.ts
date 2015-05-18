import AWS = require('aws-sdk');
import Q = require('q');

import ArticlesIndex = require('./articles-index');
import IndexInterval = require('./articles-index-interval');
import config = require('../config/configuration-manager');
import ArticleSource = require('../models/article-source');

class AwsDynamodbArticlesIndex implements ArticlesIndex {
    private dynamodb: AWS.DynamoDB;
    private indexMetadataTableName: string;

    constructor() {
        this.dynamodb = new AWS.DynamoDB({
            credentials: config.getAwsCredentialsProvider(),
            region: config.defaultAwsRegion
        });
        this.indexMetadataTableName = config.articlesIndexMetadataDynamodbTableName;
    }

    fetchIntervalsAsync(articleSource: ArticleSource,
        offset: moment.Moment /*offset inclusive*/, forward: boolean, durationSeconds: number): Q.Promise<IndexInterval[]> {
        var hashKey = articleSource.Id + ':articles';
        var rangeKey = offset.utc().toISOString();
        var deferred = Q.defer<AWS.DynamoDB.QueryResult>();
        this.dynamodb.query({
            TableName: this.indexMetadataTableName,
            KeyConditions: {
                'ArticleSourceId': {
                    ComparisonOperator: 'EQ',
                    AttributeValueList: [
                        { S: hashKey }
                    ]
                }
            }
        }, function (err, data: AWS.DynamoDB.QueryResult) {
                if (err) {
                    console.log(err);
                    deferred.reject(err);
                    return;
                }
                deferred.resolve(data);
            });
        return deferred.promise.then((r: AWS.DynamoDB.QueryResult): IndexInterval[]=> {
            var result: IndexInterval[] = [];
            if (r.Count == 0) {
                // no data
                var start: moment.Moment;
                var end: moment.Moment;
                if (forward) {
                    start = offset.clone();
                    end = offset.clone().subtract(1, 'day');
                } else {
                    start = offset.clone().subtract(1, 'day');
                    end = offset.clone();
                }
                var interval: IndexInterval = {
                    start: start,
                    end: end,
                    status: 'None'
                };
                result.push(interval);
            }
            return result;
        });
    }
}

export = AwsDynamodbArticlesIndex;
