import ArticleSource = require('../../models/article-source');
import CapturedDocument = require('../import/captured-document');

module ArticlesIndexDocument {
    export interface Item {
        url: string;
        title: string;
    }
}

class ArticlesIndexDocument extends CapturedDocument {
    private articleSource: ArticleSource;

    constructor(articleSource: ArticleSource) {
        super();
        this.articleSource = articleSource;
    }
    
    get contentType(): string {
        return 'application/json';
    }

    get articleSourceId(): string {
        return this.articleSource.Id;
    }

    get parseTimestamp(): string {
        return this.metadata['parse-timestamp'];
    }

    set parseTimestamp(value: string) {
        this.metadata['parse-timestamp'] = value;
    }

    get parserVersion(): string {
        return this.metadata['parser-version'];
    }

    set parserVersion(value: string) {
        this.metadata['parser-version'] = value;
    }

    items: ArticlesIndexDocument.Item[];

    get content(): string {
        return this.getContent();
    }

    set content(value: string) {
        this.setContent(value);
    }

    setContent(value: string):void {
        super.setContent(value);
        this.items = this.articleSource.toArticlesIndexDocumentItems(JSON.parse(value));
    }

    setContentObject(obj: any): void {
        var contentStr:string = JSON.stringify(obj);
        super.setContent(contentStr);
        this.items = this.articleSource.toArticlesIndexDocumentItems(obj);
    }

}

export = ArticlesIndexDocument;
