import ArticleSource = require('../models/article-source');
import validator = require('validator');

import articleSources = require('../config/article-sources');
import ResourceNotFoundException = require('../models/resource-not-found-exception');
import InvalidRequestException = require('../../lib/events/invalid-request-exception');

export function validateArticleSourceId(input: any): ArticleSource {
    var articleSourceId = validator.toString(input['ArticleSourceId']);
    if (articleSourceId) {
        var articleSource: ArticleSource = articleSources[articleSourceId];
        if (articleSource) {
            return articleSource;
        }
        throw new ResourceNotFoundException('InvalidArticleSourceId', 'Article Source ID not found: ' + articleSourceId);
    }
    throw InvalidRequestException.missingRequiredField('ArticleSourceId');
}
