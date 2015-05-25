import ArticleSource = require('../models/article-source');

class Article {
    private _articleSource: ArticleSource;
    private _metadata: { [name: string]: string } = {};

    constructor(articleSource: ArticleSource) {
        this._articleSource = articleSource;
    }

    // data representation
    get articleSourceId(): string {
        return this.articleSource.Id;
    }
    archiveBucket: string;
    articleId: string;
    indexLastUpdated: moment.Moment;
    status: string;
    uniqueId: string;
    content:string;

    get archiveBucketId(): string {
        return this.articleSourceId + ':' + this.archiveBucket;
    }

    get metadata(): { [name: string]: string } {
        return this._metadata;
    }

    set metadata(value: { [name: string]: string }) {
        for (var name in value) {
            this._metadata[name] = value[name];
        }
    }

    get sourceUrl(): string {
        return this.metadata['source-url'];
    }
    set sourceUrl(value: string) {
        this.metadata['source-url'] = value;
    }

    properties: {
        title?: string;
    } = {};

    toJsonObject():any {
        return {};
    }

    get articleSource():ArticleSource {
        return this._articleSource;
    }

    pupulateData(data:any) {
        this._articleSource.populateArticleData(this, data);
    }

    get timestamp():string {
        return this.metadata['article-timestamp'];
    }

    set timestamp(value:string) {
        this.metadata['article-timestamp'] = value;
    }

    get parserVersion():string {
        return this.metadata['parser-version'];
    }

    set parserVersion(value:string) {
        this.metadata['parser-version'] = value;
    }

    get parseTimestamp():string {
        return this.metadata['parse-timestamp'];
    }

    set parseTimestamp(value:string) {
        this.metadata['parse-timestamp'] = value;
    }


    get title():string {
        return this.properties.title;
    }

    set title(value:string) {
        this.properties.title = value;
    }
}

export = Article;
