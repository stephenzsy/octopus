(function () {
    'use strict';

    var getImportedDocument = require('./get_imported_document');
    var parseArchiveDailyIndex = require('./parse_achive_daily_index');
    parseArchiveDailyIndex.setGetImportedDocumentHandler(getImportedDocument);

    var handlers = module.exports = {
        ping: require('./ping'),
        ListArticleSources: require('./list_article_sources'),
        GetArticleSource: require('./get_article_source'),
        GetArchiveDailyIndex: require('./get_archive_daily_index'),
        ListArchiveDailyIndices: require('./list_archive_daily_indices'),
        ImportDocument: require('./import_document'),
        GetImportedDocument: getImportedDocument.handler,
        ParseArchiveDailyIndex: parseArchiveDailyIndex.handler,
        GetArticle: require('./get_article').handler
    };

})();