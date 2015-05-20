import moment = require('moment');
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
    syncArticlesIndexDocumentAsync(doc: ArticlesIndexDocument): Q.Promise<ArticlesIndex.Interval[]>;
    getIntervalAsync(articleSource: ArticleSource, startTimestamp: moment.Moment): Q.Promise<ArticlesIndex.Interval>;
}

export = ArticlesIndex;
