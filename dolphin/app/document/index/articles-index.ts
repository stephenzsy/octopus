﻿///<reference path="../../../scripts/typings/q/Q.d.ts"/>
import moment = require('moment');
import Q = require('q');

import ArticleSource = require('../../models/article-source');
import ArticlesIndexDocument = require('./articles-index-document');
import Article = require('../article');

module ArticlesIndex {
    export interface Interval {
        start: moment.Moment;
        end: moment.Moment;
        status: string;
        articleSourceId: string;
        archiveBucket: string;
        indexId: string;
        indexedCount?: number;
        totalCount?:number;
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
    getIntervalAsync(articleSource: ArticleSource, indexId: string): Q.Promise<ArticlesIndex.Interval>;
    updateIntervalIndexedCountAsync(articleSource: ArticleSource, interval: ArticlesIndex.Interval, newCount: number): Q.Promise<ArticlesIndex.Interval>;
    fetchArticlesByStatusAsync(articleSource:ArticleSource, status:string, limit:number): Q.Promise<Article[]>;
    getArticleAsync(articleSource:ArticleSource, articleId:string): Q.Promise<Article>;
    updateArticleStatus(article:Article, status:string):Q.Promise<Article>;
}

export = ArticlesIndex;
