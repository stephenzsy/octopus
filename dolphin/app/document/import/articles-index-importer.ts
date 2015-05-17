import moment = require('moment');
import Q = require('q');

import ArticleSource = require('../../models/article-source');
import DocumentStorage = require('../storage/document-storage');

class ArticlesIndexImporter {
    private docStore: DocumentStorage;

    constructor(docStore: DocumentStorage) {
        this.docStore = docStore;
    }

    captureArticlesIndexAsync(articleSource: ArticleSource, timestamp: moment.Moment): Q.Promise<any> {
        var docInfo: {
            archiveBucket: string,
            documentId: string
        } = articleSource.getDocumentInfoForTimestamp(timestamp);
        this.docStore.getCapturedDocumentAsync(articleSource.Id, docInfo.archiveBucket, docInfo.documentId);
        return null;
    }
}

export = ArticlesIndexImporter;
