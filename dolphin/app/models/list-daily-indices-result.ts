import Result = require('../../lib/events/result');
import DailyIndexMetadata = require('./daily-index-metadata');


class ListDailyIndicesResult implements Result<ListDailyIndicesResult> {
    DailyIndicesMetadata:DailyIndexMetadata[];

    toJsonObject():any {
        return {
            "DailyIndicesMetadata": this.DailyIndicesMetadata.map((metadata:DailyIndexMetadata):any=> {
                return metadata.toJsonObject();
            })
        };
    }
}

export = ListDailyIndicesResult;
