(function () {
    "use strict";

    var articleSources = {};

    ['./businessinsider', './bloomberg'].forEach(function (req) {
        var c = require(req);
        var s = new c();
        articleSources[s.getId()] = s;
    });

    module.exports = articleSources;
})();
