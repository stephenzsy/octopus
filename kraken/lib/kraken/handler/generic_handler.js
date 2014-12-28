var Q = require('q');

(function () {
    'use strict';

    function GenericHandler() {
        var _this = this;

        this.handler = function (arg1, arg2) {
            var r = undefined;
            var result = undefined;
            var timeStart = process.hrtime();
            try {
                if (arg2 === undefined) {
                    // no input
                    result = arg1;
                    console.log(_this.getMethodName());
                    r = _this.enact();
                } else {
                    result = arg2;
                    console.log(_this.getMethodName() + " Input: ", arg1);
                    r = _this.enact(arg1);
                }
                if (_this.isAsync) {
                    r.done(function (rr) {
                        result(null, rr);
                    }, function (err) {
                        console.error(err);
                        console.error(err.stack);
                        result(err);
                    });
                } else {
                    result(null, r);
                }
                console.log(_this.getMethodName() + " Output:", r);
            } catch (e) {
                result(e);
                console.error(_this.getMethodName() + " Exception:", e);
            } finally {
            }
        };
    }

    GenericHandler.prototype.isAsync = false;

    module.exports = GenericHandler;
})();