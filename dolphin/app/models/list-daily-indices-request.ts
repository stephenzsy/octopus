import Request = require('../../lib/events/request');

class ListDailyIndicesRequest implements Request<ListDailyIndicesRequest> {
    ArticleSourceId:string;
    EndDateTime:string; // date time in ISO8601
    Limit:number;
}

export = ListDailyIndicesRequest;