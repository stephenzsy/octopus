﻿import moment = require('moment');
import Q = require('q');

import ArticleSource = require('../models/article-source');
import ArticlesIndexDocument = require('./index/articles-index-document');

module ArticlesIndex {
    export interface Interval {
        start: moment.Moment;
        end: moment.Moment;
        status: string;
        articleSourceId: string;
        archiveBucket: string;
        indexId: string;
        indexedCount?: number;
    }

    export var Status = {
        None: 'None',
        SourcePartial: 'SourcePartial',
        SourceReady: 'SourceReady'
    }
}

interface ArticlesIndex {
    fetchIntervalsAsync(articleSource: ArticleSource,
        offset: moment.Moment /*offset inclusive*/, limit: number): Q.Promise<ArticlesIndex.Interval[]>;
    markSourceStatusAsync(doc: ArticlesIndexDocument): Q.Promise<ArticlesIndex.Interval>;
    syncArticlesIndexDocumentAsync(articleSource: ArticleSource, doc: ArticlesIndexDocument, offset: number): Q.Promise<number>;
    getIntervalAsync(articleSource: ArticleSource, startTimestamp: moment.Moment): Q.Promise<ArticlesIndex.Interval>;
    updateIntervalIndexedCountAsync(articleSource: ArticleSource, interval: ArticlesIndex.Interval, newCount: number): Q.Promise<ArticlesIndex.Interval>;
}

export = ArticlesIndex;
