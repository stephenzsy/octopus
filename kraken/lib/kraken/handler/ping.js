var util = require('util');
var GenericHandler = require('./generic_handler');

(function () {
    "use strict";

    function PingHandler() {
        GenericHandler.call(this);
    }

    util.inherits(PingHandler, GenericHandler);

    PingHandler.prototype.getMethodName = function () {
        return 'ping';
    };
    PingHandler.prototype.enact = function () {
    };

    var handler = module.exports = new PingHandler().handler;
})();
