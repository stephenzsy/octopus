import AWS = require('aws-sdk');
import Q = require('q');

import ArticlesIndex = require('./articles-index');
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
        offset: moment.Moment /*offset inclusive*/, forward: boolean, durationSeconds: number): Q.Promise<ArticlesIndex.Interval[]> {
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
        return deferred.promise.then((r: AWS.DynamoDB.QueryResult): ArticlesIndex.Interval[]=> {
            var result: ArticlesIndex.Interval[] = [];
            if (r.Count == 0) {
                // no data, display 2 days backwards
                for (var i: number = 0; i < 2; ++i) {
                    var start: moment.Moment = offset.clone().subtract(i + 1, 'day');
                    var end: moment.Moment = offset.clone().subtract(i, 'day');
                    var interval: ArticlesIndex.Interval = {
                        start: start,
                        end: end,
                        status: 'None'
                    }
                    result.push(interval);
                }
            }
            return result;
        });
    }
}

export = AwsDynamodbArticlesIndex;
