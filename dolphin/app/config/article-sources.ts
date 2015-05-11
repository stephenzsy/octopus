import ArticleSource = require('../models/article-source');

var articleSources:{ [s: string]: ArticleSource; } = {};
(()=>{
    {
        var as:ArticleSource = new ArticleSource();
        as.Id = 'bi';
        as.Name = 'Business Insider';
        as.Url = 'http://www.businessinsider.com';
        as.defaultTimezone = 'America/New_York';
        articleSources[as.Id] = as;
    }
})();

export = articleSources;
