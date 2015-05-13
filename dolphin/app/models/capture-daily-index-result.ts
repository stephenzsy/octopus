import Result = require('../../lib/events/result');
import CapturedDocument = require('./captured-document');

class CaptureDailyIndexResult implements Result<CaptureDailyIndexResult> {
    CapturedDocument:CapturedDocument;

    toJsonObject():any {
        return {
            "CapturedDocument": this.CapturedDocument.toJsonObject()
        };
    }
}

export = CaptureDailyIndexResult;
