///<reference path="../../scripts/typings/validator/validator.d.ts"/>

import validator = require('validator');

class CapturedDocument {
    ArticleSourceId:string;
    DocumentId:string;
    ArchiveBucket:string;
    Content:string;
    ContentHash:string; // base64 representation of sha 256 hash
    OriginalUrl:string;
    CaptureTimestamp:string;
    Metadata:{ [s: string]: string };

    toJsonObject():any {
        return {
            "ArticleSourceId": this.ArticleSourceId
        }
    }

    private static ID_PATTERN:RegExp = /^[A-Za-z0-9_\-]+$/;
    private static ARCHIVE_BUCKET_PATTERN:RegExp = /^[A-Za-z0-9_\-\/]+$/;

    validateFields():boolean {
        if (!this.ArticleSourceId || !validator.matches(this.ArticleSourceId, CapturedDocument.ID_PATTERN)
            || !this.DocumentId || !validator.matches(this.DocumentId, CapturedDocument.ID_PATTERN)
            || !this.ArchiveBucket || !validator.matches(this.ArchiveBucket, CapturedDocument.ARCHIVE_BUCKET_PATTERN)) {
            return false;
        }
        return true;
    }
}

export = CapturedDocument;