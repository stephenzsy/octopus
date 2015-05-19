import CapturedDocument = require('./import/captured-document');

module ArticleIndexDocument {
    export interface Item {
        url: string;
        title: string;
    }
}

class ArticleIndexDocument extends CapturedDocument {
    parseTimestamp: string;
    parserVersion: string;
    items: ArticleIndexDocument.Item[];
}

export = ArticleIndexDocument;
