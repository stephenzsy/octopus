var util = require('util');
var GenericHandler = require('./generic_handler');
var Kraken = require('kraken-model').Types;

(function () {
    "use strict";

    function ImportDocument() {
        GenericHandler.call(this);
    }

    util.inherits(ImportDocument, GenericHandler);

    ImportDocument.prototype.getMethodName = function () {
        return 'ImportDocument';
    };

    ImportDocument.prototype.enact = function (/*ImportDocumentRequest*/ request) {
        var result = new Kraken.ImportDocumentResult();
        return result;
    };

    var handler = module.exports = new ImportDocument().handler;
})();
