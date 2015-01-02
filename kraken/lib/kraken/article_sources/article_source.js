var moment = require('moment-timezone');

(function () {
    "use strict";

    function ArticleSource() {
    }

    ArticleSource.prototype.validateDocumentIdForType = function (type, id) {
        var datetime = moment.tz(id, this.getTimezone());
        if (!datetime.isValid() || datetime.format('YYYY-MM-DD') !== id) {
            throw new Kraken.ValidationError({
                ErrorCode: 'InvalidDocumentId.Malformed',
                Message: "Invalid document ID: " + id
            });
        }
    };

    module.exports = ArticleSource;
})();