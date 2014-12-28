var express = require('express');
var router = express.Router();

"use strict";

var handler = function (req, res) {
    res.sendFile('index.html', {root: '../public'})
};

router.get('/', handler);
router.get('/article_source/:article_source_id', handler);
router.get('/daily_index/:article_source_id/:daily_index_id', handler);
router.get('/status', handler);

router.get('/js/lib/kraken_types.js', function (req, res) {
    res.sendFile("kraken_types.js", {root: "../node_modules/kraken-model/model/gen-js"});
});
router.get('/js/lib/KrakenService.js', function (req, res) {
    res.sendFile("KrakenService.js", {root: "../node_modules/kraken-model/model/gen-js"});
});

module.exports = router;
