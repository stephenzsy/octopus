import validator = require('validator');

class CapturedDocument {
    articleSourceId: string;
    documentId: string;
    archiveBucket: string;
    private _content: string;
    metadata: { [s: string]: string } = {};

    get timestamp(): string {
        return this.metadata['capture-time'];
    }

    set timestamp(value: string) {
        this.metadata['capture-time'] = value;
    }

    get sourceUrl(): string {
        return this.metadata['source-url'];
    }

    set sourceUrl(value: string) {
        this.metadata['source-url'] = value;
    }

    get contentType(): string {
        return 'text/html';
    }

    get validBeforeTimestamp(): string {
        return this.metadata['valid-before'];
    }

    set validBeforeTimestamp(value: string) {
        this.metadata['valid-before'] = value;
    }

    toJsonObject(): any {
        return {
            "ArticleSourceId": this.articleSourceId,
            "DocumentId": this.documentId
        }
    }

    private static ID_PATTERN: RegExp = /^[A-Za-z0-9_\-]+$/;
    private static ARCHIVE_BUCKET_PATTERN: RegExp = /^[A-Za-z0-9_\-\/]+$/;

    validateFields(): boolean {
        if (!this.articleSourceId || !validator.matches(this.articleSourceId, CapturedDocument.ID_PATTERN)
            || !this.documentId || !validator.matches(this.documentId, CapturedDocument.ID_PATTERN)
            || !this.archiveBucket || !validator.matches(this.archiveBucket, CapturedDocument.ARCHIVE_BUCKET_PATTERN)) {
            return false;
        }
        return true;
    }

    get content(): string {
        return this.getContent();
    }

    set content(value: string) {
        this.setContent(value);
    }

    getContent(): string {
        return this._content;
    }

    setContent(value: string): void {
        this._content = value;
    }
}

export = CapturedDocument;