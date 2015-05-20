import AWS = require('aws-sdk');
import Q = require('q');

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

    fetchIntervalsAsync(articleSource: ArticleSource,
        offset: moment.Moment /*offset inclusive*/, limit: number): Q.Promise<ArticlesIndex.Interval[]> {
        var hashKey = articleSource.Id + ':articles';
        var rangeKey = offset.utc().toISOString();
        var deferred = Q.defer<AWS.DynamoDB.QueryResult>();
        return Q.ninvoke(this.dynamodb, 'query', {
            TableName: this.indexMetadataTableName,
            KeyConditions: {
                'Partition': {
                    ComparisonOperator: 'EQ',
                    AttributeValueList: [
                        { S: hashKey }
                    ]
                }
            }
        }).then((r: AWS.DynamoDB.QueryResult): ArticlesIndex.Interval[]=> {
            var result: ArticlesIndex.Interval[] = [];
            if (r.Count == 0) {
                // no data, display <limit> days backwards
                for (var i: number = 0; i < limit; ++i) {
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
            console.log("fetch complete");
            return result;
        });
    }

    static Status = {
        None: 'None',
        SourcePartial: 'SourcePartial',
        SourceReady: 'SourceReady'
    }

    markSourceStatusAsync(doc: ArticlesIndexDocument): Q.Promise<ArticlesIndex.Interval> {
        var coverage: ArticlesIndexDocument.Coverage = doc.coverage;
        var params: AWS.DynamoDB.PutItemRequest = {
            TableName: this.indexMetadataTableName,
            Item: {}
        }
        params.Item['Partition'] = { S: doc.coverage.partition };
        params.Item['StartTs'] = { S: doc.coverage.start.utc().toISOString() };
        params.Item['EndTs'] = { S: doc.coverage.end.utc().toISOString() };

        var status: string = 'Unknown';
        switch (doc.coverage.status) {
            case ArticlesIndexDocument.Status.Complete:
                status = AwsDynamodbArticlesIndex.Status.SourceReady;
                break;
            case ArticlesIndexDocument.Status.Partial:
                status = AwsDynamodbArticlesIndex.Status.SourcePartial;
                break;
            default:
                throw ('WTF');
        }

        params.Item['ArticleSourceId'] = { S: doc.articleSourceId };
        params.Item['ArchiveBucket'] = { S: doc.archiveBucket };
        params.Item['IndexId'] = { S: doc.documentId };
        params.Item['Status'] = { S: status };

        return Q.ninvoke(this.dynamodb, 'putItem', params)
            .then(function (data: AWS.DynamoDB.PutItemResult): ArticlesIndex.Interval {
            console.log(data);
            return {
                start: doc.coverage.start,
                end: doc.coverage.end,
                status: status
            };
        });
    }

    syncArticlesIndexDocumentAsync(doc: ArticlesIndexDocument): Q.Promise<ArticlesIndex.Interval[]> {
        return null;
    }

}

export = AwsDynamodbArticlesIndex;
