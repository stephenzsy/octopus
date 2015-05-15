import ArticleSource = require('../models/article-source');
import HtmlSanitizer = require('../document/transform/html-sanitizer');

var articleSources:{ [s: string]: ArticleSource; } = {};
(()=> {
    {
        var as:ArticleSource = new ArticleSource();
        as.Id = 'bi';
        as.Name = 'Business Insider';
        as.Url = 'http://www.businessinsider.com';
        as.defaultTimezone = 'America/New_York';
        as.getDailyIndexUrl = (dateStr:string):string => {
            return 'http://www.businessinsider.com/archives?date=' + dateStr;
        };
        as.dailyIndexSanitizer = new HtmlSanitizer(require('../vendor/business-insider/daily-index-sanitizer-config.json'));
        articleSources[as.Id] = as;
    }
})();

export = articleSources;
