///<reference path="../../../scripts/typings/q/Q.d.ts"/>

import CapturedDocument = require('../import/captured-document');
import ArticlesIndexDocument = require('../index/articles-index-document');
import ArticleSource = require('../../models/article-source');
import Q = require('q');

interface DocumentStorage {
    storeCapturedDocumentAsync(doc: CapturedDocument): Q.Promise<any>;
    getCapturedDocumentAsync(articleSourceId: string, documentType: string, archiveBucket: string, documentId: string): Q.Promise<CapturedDocument>;
    getArticlesIndexAsync(articleSource: ArticleSource, archiveBucket: string, indexId: string): Q.Promise<ArticlesIndexDocument>;
}

export = DocumentStorage;