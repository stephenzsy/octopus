import ArticleSource = require('../models/article-source');
import validator = require('validator');
import moment = require('moment');

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

export function validateTimestamp(input: any, field: string): moment.Moment {
    if (!input[field]) return null;
    input[field] = validator.toString(input[field]);
    var timestamp: moment.Moment = moment(input[field]);
    if (!timestamp.isValid()) {
        throw InvalidRequestException.invalidFieldValue(field);
    }
    return timestamp;
}

export function validateNumber(input: any, field: string, min: number, max: number, defaultValue: number): number {
    if (typeof input[field] === 'undefined' || input[field] === null) {
        return defaultValue;
    }
    if (!validator.isInt(validator.toString(input[field]), { min: min, max: max })) {
        throw InvalidRequestException.invalidFieldValue(field);
    }
    return validator.toInt(input[field]);
}
