import CapturedDocument = require('../../models/captured-document');

interface DocumentStorage {
    storeCapturedDocumentAsync(doc: CapturedDocument): Q.Promise<any>;
    getCapturedDocumentAsync(articleSourceId: string, archiveBucket: string, documentId: string): Q.Promise<CapturedDocument>;
}

export = DocumentStorage;