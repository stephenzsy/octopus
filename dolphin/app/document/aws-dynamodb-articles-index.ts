import AWS = require('aws-sdk');
import Q = require('q');
import moment = require('moment');

import ArticlesIndex = require('./articles-index');
import config = require('../config/configuration-manager');
import ArticleSource = require('../models/article-source');
import ArticlesIndexDocument = require('./index/articles-index-document');
import utils = require('./utils');

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

    private static itemToInterval(item: { [attributeName: string]: AWS.DynamoDB.AttributeValue }): ArticlesIndex.Interval {
        return {
            start: moment(item['StartTs'].S),
            end: moment(item['EndTs'].S),
            status: item['Status'].S,
            archiveBucket: item['ArchiveBucket'].S,
            indexId: item['IndexId'].S,
            articleSourceId: item['ArticleSourceId'].S
        };
    }

    fetchIntervalsAsync(articleSource: ArticleSource,
        offset: moment.Moment /*offset inclusive*/, limit: number): Q.Promise<ArticlesIndex.Interval[]> {
        var articlesIndex: AwsDynamodbArticlesIndex = this;

        var hashKey = articleSource.indexPartition;
        var rangeKey = offset.utc().toISOString();
        return utils.awsQInvoke<AWS.DynamoDB.QueryRequest, AWS.DynamoDB.QueryResult>(this.dynamodb, 'query', {
            TableName: this.indexMetadataTableName,
            KeyConditions: {
                "Partition": {
                    ComparisonOperator: "EQ",
                    AttributeValueList: [
                        { S: hashKey }
                    ]
                },
                "StartTs": {
                    ComparisonOperator: "LT",
                    AttributeValueList: [
                        { S: rangeKey }
                    ]
                }
            },
            Limit: limit,
            ScanIndexForward: false
        }).then((queryResult: AWS.DynamoDB.QueryResult): ArticlesIndex.Interval[]=> {
            var result: ArticlesIndex.Interval[];
            if (queryResult.Count == 0) {
                // no data, display <limit> days backwards
                result = [];
                for (var i: number = 0; i < limit; ++i) {
                    var start: moment.Moment = offset.clone().subtract(i + 1, 'day');
                    var end: moment.Moment = offset.clone().subtract(i, 'day');
                    var interval: ArticlesIndex.Interval = {
                        start: start,
                        end: end,
                        status: ArticlesIndex.Status.None,
                        articleSourceId: articleSource.Id,
                        archiveBucket: null,
                        indexId: null
                    };
                    result.push(interval);
                }
            } else {
                result = [];
                for (var i: number = 0, ii: number = 0; i < limit; ++i) {
                    var interval: ArticlesIndex.Interval = (ii >= queryResult.Items.length) ? null : AwsDynamodbArticlesIndex.itemToInterval(queryResult.Items[ii]);
                    if (interval == null || offset.isAfter(interval.end)) {
                        var start: moment.Moment = interval.end;
                        var previousDay: moment.Moment = offset.clone().subtract(1, 'day');
                        if (start.isBefore(previousDay)) {
                            start = previousDay;
                        }
                        result.push({
                            start: start,
                            end: offset,
                            status: ArticlesIndex.Status.None,
                            articleSourceId: articleSource.Id,
                            archiveBucket: null,
                            indexId: null
                        });
                        offset = start;
                    } else {
                        result.push(interval);
                        offset = interval.start;
                        ++ii;
                    }
                }
            }
            return result;
        });
    }


    markSourceStatusAsync(doc: ArticlesIndexDocument): Q.Promise<ArticlesIndex.Interval> {
        var articlesIndex: AwsDynamodbArticlesIndex = this;

        var coverage: ArticlesIndexDocument.Coverage = doc.coverage;
        var params: AWS.DynamoDB.PutItemRequest = {
            TableName: this.indexMetadataTableName,
            Item: {
                "Partition": { S: doc.coverage.partition }, // hash key
                "StartTs": { S: doc.coverage.start.utc().toISOString() }, // range key
                "EndTs": { S: doc.coverage.end.utc().toISOString() },
                "ArticleSourceId": { S: doc.articleSourceId },
                "ArchiveBucket": { S: doc.archiveBucket },
                "IndexId": { S: doc.documentId }
            }
        };

        var status: string = 'Unknown';
        switch (doc.coverage.status) {
            case ArticlesIndexDocument.Status.Complete:
                status = ArticlesIndex.Status.SourceReady;
                break;
            case ArticlesIndexDocument.Status.Partial:
                status = ArticlesIndex.Status.SourcePartial;
                break;
            default:
                throw ('WTF');
        }
        params.Item['Status'] = { S: status };

        return Q.ninvoke(this.dynamodb, 'putItem', params)
            .then(function (data: AWS.DynamoDB.PutItemResult): ArticlesIndex.Interval {
            console.log(data);
            return AwsDynamodbArticlesIndex.itemToInterval(params.Item);
        });
    }

    syncArticlesIndexDocumentAsync(doc: ArticlesIndexDocument): Q.Promise<ArticlesIndex.Interval[]> {
        return null;
    }

    getIntervalAsync(articleSource: ArticleSource, startTimestamp: moment.Moment): Q.Promise<ArticlesIndex.Interval> {
        var params: AWS.DynamoDB.GetItemRequest = {
            TableName: this.indexMetadataTableName,
            Key: {
                "Partition": { S: articleSource.indexPartition },
                "StartTs": { S: startTimestamp.utc().toISOString() }
            }
        };
        return utils.awsQInvoke<AWS.DynamoDB.GetItemRequest, AWS.DynamoDB.GetItemResult>(this.dynamodb, 'getItem', params)
            .then(function (getItemResult: AWS.DynamoDB.GetItemResult): ArticlesIndex.Interval {
            return AwsDynamodbArticlesIndex.itemToInterval(getItemResult.Item);
        });
    }

}

export = AwsDynamodbArticlesIndex;
