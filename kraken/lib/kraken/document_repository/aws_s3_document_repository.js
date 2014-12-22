var util = require("util");

var DocumentRepository = require('./document_repository');

(function () {
    "use strict";

    function AwsS3DocumentRepository() {
        DocumentRepository.call(this);
    }

    util.inherits(AwsS3DocumentRepository, DocumentRepository);

    module.exports = AwsS3DocumentRepository;

})();
