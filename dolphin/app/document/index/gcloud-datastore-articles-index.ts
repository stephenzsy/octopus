///<reference path="../../../scripts/typings/gcloud/gcloud.d.ts"/>
///<reference path="../../../scripts/typings/node/node.d.ts"/>

import AWS = require('aws-sdk');
import gcloud = require('gcloud');
import Q = require('q');
import moment = require('moment');

import Article = require('../article');
import ArticlesIndex = require('./articles-index');
import AwsDynamodbArticlesIndex = require('./aws-dynamodb-articles-index');
import config = require('../../config/configuration-manager');
import ArticleSource = require('../../models/article-source');
import ArticlesIndexDocument = require('./articles-index-document');
import utils = require('../utils');

class GcloudDatastoreArticlesIndex extends AwsDynamodbArticlesIndex {
    private dataset:gcloud.Datastore.Dataset;

    private static KIND:string = "ArticlesIndex";

    constructor() {
        super();
        this.dataset = gcloud.datastore.dataset({
            keyFilename: process.env['HOME'] + "/.gcloud/dolphin-creds.json",
            projectId: config.gcloudProjectId
        });
    }

    private static entityToInterval(entity:gcloud.Datastore.Entity):ArticlesIndex.Interval {
        var data:any = entity.data;
        return {
            start: moment(data['StartTs']),
            end: moment(data['EndTs']),
            status: data['Status'],
            articleSourceId: data['ArticleSourceId'],
            archiveBucket: data['ArchiveBucket'],
            indexId: data['IndexId'],
            indexedCount: data['IndexedCount'],
            totalCount: data['TotalCount']
        };
    }

    markSourceStatusAsync(doc:ArticlesIndexDocument):Q.Promise<ArticlesIndex.Interval> {
        var dataset:gcloud.Datastore.Dataset = this.dataset;

        var coverage:ArticlesIndexDocument.Coverage = doc.coverage;
        var startTs:string = coverage.start.utc().toISOString();
        var status:string = 'Unknown';
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
        var entity:gcloud.Datastore.Entity = {
            key: dataset.key([GcloudDatastoreArticlesIndex.KIND, coverage.partition + '/' + doc.documentId]),
            data: {
                "Partition": coverage.partition,
                "StartTs": startTs,
                "EndTs": coverage.end.utc().toISOString(),
                "ArticleSourceId": doc.articleSourceId,
                "ArchiveBucket": doc.archiveBucket,
                "IndexId": doc.documentId,
                "Status": status,
                "TotalCount": gcloud.datastore.int(doc.items.length),
                "IndexedCount": gcloud.datastore.int(0)
            }
        };
        return Q.ninvoke(dataset, 'save', entity).then(function ():ArticlesIndex.Interval {
            return {
                start: coverage.start,
                end: coverage.end,
                status: status,
                articleSourceId: doc.articleSourceId,
                archiveBucket: doc.archiveBucket,
                indexId: doc.documentId,
                indexedCount: 0,
                totalCount: doc.items.length
            };
        });
    }

    fetchIntervalsAsync(articleSource:ArticleSource,
                        offset:moment.Moment /*offset inclusive*/, limit:number):Q.Promise<ArticlesIndex.Interval[]> {
        var articlesIndex:GcloudDatastoreArticlesIndex = this;

        var query:gcloud.Datastore.Query = this.dataset.createQuery(GcloudDatastoreArticlesIndex.KIND)
            .filter('Partition =', articleSource.indexPartition)
            .filter('StartTs <', offset.utc().toISOString())
            .order('-StartTs')
            .limit(limit);
        return Q.ninvoke(this.dataset, 'runQuery', query)
            .then(function (entities:gcloud.Datastore.Entity[]):ArticlesIndex.Interval[] {
                var result:ArticlesIndex.Interval[] = [];
                offset = offset.clone();
                for (var i:number = 0, ii:number = 0; i < limit; ++i) {
                    var interval:ArticlesIndex.Interval = (ii >= entities.length) ? null : GcloudDatastoreArticlesIndex.entityToInterval(entities[ii]);
                    if (interval == null || offset.isAfter(interval.end)) {
                        var start:moment.Moment;
                        var previousDay:moment.Moment = offset.clone().subtract(1, 'day');
                        if (interval == null || interval.end.isBefore(previousDay)) {
                            start = previousDay;
                        } else {
                            start = interval.end;
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

                return result;
            });
    }

}

export = GcloudDatastoreArticlesIndex;
