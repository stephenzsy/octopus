import Result = require('../../lib/events/result');
import ArticleSource = require('./article-source');

class ImportArticlesIndexResult implements Result<ImportArticlesIndexResult> {
    archiveBucket: string;
    indexId: string;
    startTimestamp: string;
    endTimestamp: string;
    status: string;

    toJsonObject(): any {
        return {
            "Imported": {
                "ArchiveBucket": this.archiveBucket,
                "IndexId": this.indexId,
                "Start": this.startTimestamp,
                "End": this.endTimestamp,
                "Status": this.status
            }
        };
    }
}

export = ImportArticlesIndexResult;
