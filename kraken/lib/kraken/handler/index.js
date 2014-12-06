(function () {
    'use strict';

    var handlers = module.exports = {
        ping: require('./ping'),
        ListArticleSources: require('./list_article_sources'),
        GetArticleSource: require('./get_article_source'),
        GetArchiveDailyIndex: require('./get_archive_daily_index')
    };

})();