///<reference path="../../../scripts/typings/gcloud/gcloud.d.ts"/>
///<reference path="../../../scripts/typings/node/node.d.ts"/>
///<reference path="../../../scripts/typings/node-uuid/node-uuid.d.ts"/>

import AWS = require('aws-sdk');
import gcloud = require('gcloud');
import Q = require('q');
import moment = require('moment');
var uuid = require('uuid');

import Article = require('../article');
import ArticlesIndex = require('./articles-index');
import AwsDynamodbArticlesIndex = require('./aws-dynamodb-articles-index');
import config = require('../../config/configuration-manager');
import ArticleSource = require('../../models/article-source');
import ArticlesIndexDocument = require('./articles-index-document');
import utils = require('../utils');

class GcloudDatastoreArticlesIndex implements ArticlesIndex {
    private dataset:gcloud.Datastore.Dataset;

    private static KIND:string = "ArticlesIndex";
    private static ARTICLES_KIND:string = 'Articles';

    constructor() {
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

    private intervalToEntity(articleSource:ArticleSource, interval:ArticlesIndex.Interval):gcloud.Datastore.Entity {
        return {
            key: this.dataset.key([GcloudDatastoreArticlesIndex.KIND, articleSource.indexPartition + '/' + interval.indexId]),
            data: {
                "Partition": articleSource.indexPartition,
                "StartTs": interval.start.utc().toISOString(),
                "EndTs": interval.end.utc().toISOString(),
                "Status": interval.status,
                "ArticleSourceId": interval.articleSourceId,
                "ArchiveBucket": interval.archiveBucket,
                "IndexId": interval.indexId,
                "IndexedCount": gcloud.datastore.int(interval.indexedCount),
                "TotalCount": gcloud.datastore.int(interval.totalCount)
            }
        }
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

    syncArticlesIndexDocumentAsync(articleSource:ArticleSource, doc:ArticlesIndexDocument, offset:number):Q.Promise<number> {
        var entities:gcloud.Datastore.Entity[] = [];
        for (var i:number = offset, j:number = 0; i < doc.items.length && j < 25; ++i, ++j) {
            var item:ArticlesIndexDocument.Item = doc.items[i];
            var article:Article = new Article(articleSource);
            article.archiveBucket = item.archiveBucket;
            article.articleId = item.id;
            article.sourceUrl = item.url;
            article.properties.title = item.title;
            article.uniqueId = uuid.v4();
            article.status = 'Init';
            entities.push(this.articleToEntity(article));
        }
        return Q.ninvoke(this.dataset, 'save', entities).then(function ():number {
            return entities.length;
        });
    }

    updateIntervalIndexedCountAsync(articleSource:ArticleSource, interval:ArticlesIndex.Interval, newCount:number/*not used*/):Q.Promise<ArticlesIndex.Interval> {
        return Q.ninvoke(this.dataset, 'update', this.intervalToEntity(articleSource, interval)).then(function ():ArticlesIndex.Interval {
            return interval;
        });
    }

    getIntervalAsync(articleSource:ArticleSource, indexId:string):Q.Promise<ArticlesIndex.Interval> {
        return Q.ninvoke(this.dataset, 'get', this.dataset.key([GcloudDatastoreArticlesIndex.KIND, articleSource.indexPartition + '/' + indexId]))
            .then(GcloudDatastoreArticlesIndex.entityToInterval);
    }

    private articleToEntity(article:Article):gcloud.Datastore.Entity {
        return {
            key: this.dataset.key([GcloudDatastoreArticlesIndex.ARTICLES_KIND, article.uniqueId]),
            data: {
                "ArticleSourceId": article.articleSourceId,
                "ArchiveBucket": article.archiveBucket,
                "ArticleId": article.articleId,
                "SourceUrl": article.sourceUrl,
                "Status": article.status,
                "LastUpdated": moment().utc().toISOString()
            }
        };
    }

    private entityToArticle(articleSource:ArticleSource, entity:gcloud.Datastore.Entity):Article {
        var data:any = entity.data;
        var article:Article = new Article(articleSource);
        article.articleId = data['ArticleId'];
        article.archiveBucket = data['ArchiveBucket'];
        article.sourceUrl = data['SourceUrl'];
        article.indexLastUpdated = moment(data['LastUpdated']);
        article.status = data['Status'];
        article.uniqueId = entity.key.path[1];
        return article;
    }

    fetchArticlesByStatusAsync(articleSource:ArticleSource, status:string, limit:number):Q.Promise<Article[]> {
        var _cthis:GcloudDatastoreArticlesIndex = this;
        var query:gcloud.Datastore.Query = this.dataset.createQuery(GcloudDatastoreArticlesIndex.ARTICLES_KIND)
            .filter('ArticleSourceId =', articleSource.Id)
            .filter('Status =', status)
            .order('+LastUpdated')
            .limit(limit);
        return Q.ninvoke(this.dataset, 'runQuery', query)
            .then(function (entities:gcloud.Datastore.Entity[]):Article[] {
                return entities.map(function (entity:gcloud.Datastore.Entity) {
                    return _cthis.entityToArticle(articleSource, entity);
                });
            });
    }
}

export = GcloudDatastoreArticlesIndex;
