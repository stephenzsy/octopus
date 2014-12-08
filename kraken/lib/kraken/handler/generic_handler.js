(function () {
    'use strict';

    module.exports = function GenericHandler() {
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
                result(null, r);
                console.log(_this.getMethodName() + " Output:", r);
            } catch (e) {
                result(e);
                console.error(_this.getMethodName() + " Exception:", e);
            } finally {
            }
        };
    };
})();