(function () {
    "use strict";

    var articleSources = {};

    {
        var c = require('./businessinsider');
        var s = new c();
        articleSources[s.getId()] = s;
    }

    module.exports = articleSources;
})();
