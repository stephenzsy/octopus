var util = require('util');
var GenericHandler = require('./generic_handler');
var Kraken = require('../../../model/gen-nodejs/kraken_types');

(function () {
    "use strict";

    function GetArchiveDailyIndex() {
        GenericHandler.call(this);
    }

    util.inherits(GetArchiveDailyIndex, GenericHandler);

    GetArchiveDailyIndex.prototype.getMethodName = function () {
        return 'GetArchiveDailyIndex';
    };

    GetArchiveDailyIndex.prototype.enact = function (/*GetArchiveDailyIndexRequest*/ request) {
        var result = new Kraken.ArchiveDailyIndex();
        return result;
    };

    var handler = module.exports = new GetArchiveDailyIndex().handler;
})();
