class DailyIndexMetadata {
    Id:string;
    ArticleSourceId:string;
    LocalDate:string;
    CaptureTimestamp:string;
    IsComplete:boolean;
    Timezone:string;
    Url:string;

    toJsonObject():any {
        return {
            "Id": this.Id,
            "ArticleSourceId": this.ArticleSourceId,
            "LocalDate": this.LocalDate,
            "CaptureTimestamp": this.CaptureTimestamp,
            "IsComplete": this.IsComplete,
            "Timezone": this.Timezone,
            "Url": this.Url
        }
    }
}

export = DailyIndexMetadata;