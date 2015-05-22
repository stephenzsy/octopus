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

    private static KIND:string = "articles-index";

    constructor() {
        super();
        this.dataset = gcloud.datastore.dataset({
            keyFilename: process.env['HOME'] + "/.gcloud/dolphin-creds.json",
            projectId: config.gcloudProjectId
        });
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
            key: dataset.key([GcloudDatastoreArticlesIndex.KIND, coverage.partition + '/' + doc.archiveBucket + '/' + doc.documentId]),
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
                indexedCount: 0
            };
        });
    }

}

export = GcloudDatastoreArticlesIndex;
