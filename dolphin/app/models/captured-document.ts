class CapturedDocument {
    ArticleSourceId:string;
    DocumentId:string;
    ArchiveBucket:string;
    Content:string;
    ContentHash:string; // base64 representation of sha 256 hash
    OriginalUrl:string;
    CaptureTimestamp:string;
    Metadata:{[s:string]:string};

    toJsonObject():any {
        return {
            "ArticleSourceId": this.ArticleSourceId
        }
    }
}

export = CapturedDocument;