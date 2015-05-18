import Result = require('../../lib/events/result');
import CapturedDocument = require('../document/import/captured-document');

class CaptureDailyIndexResult implements Result<CaptureDailyIndexResult> {
    CapturedDocument:CapturedDocument;

    toJsonObject():any {
        return {
            "CapturedDocument": this.CapturedDocument.toJsonObject()
        };
    }
}

export = CaptureDailyIndexResult;
