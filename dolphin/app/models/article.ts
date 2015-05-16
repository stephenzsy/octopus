class Article {
    SourceId: string;
    Id: string;
    CreateTimestamp: string; // ISO8601
    LastUpdatedTimestamp: string; // ISO8601

    Content: any; // content JSON
    ContentHash: string; // sha256 digest of json representation
}

export = Article;
