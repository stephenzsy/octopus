import UserException = require('../../lib/events/user-exception')

class ResourceNotFoundException extends UserException {
    static Code = {
        InvalidArticleSourceId: 'InvalidArticleSourceId'
    };
}

export = ResourceNotFoundException;