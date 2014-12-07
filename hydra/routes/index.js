var express = require('express');
var router = express.Router();

/* GET home page. */
var handler = function (req, res) {
    res.sendFile('index.html', {root: '../public'})
};

router.get('/', handler);
router.get('/article_source/:article_source_id', handler);
router.get('/status', handler);

module.exports = router;
