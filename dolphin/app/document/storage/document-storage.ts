import CapturedDocument = require('../../models/captured-document');

interface DocumentStorage {
    storeCapturedDocumentAsync(doc:CapturedDocument):Q.Promise<any>;
}

export = DocumentStorage;