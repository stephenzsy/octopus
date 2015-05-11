class ArticleSource {
    Id:string;
    Name:string;
    Url:string;

    defaultTimezone:string;

    toJsonObject():any {
        return {
            "Id": this.Id,
            "Name": this.Name,
            "Url": this.Url
        }
    }
}

export = ArticleSource;