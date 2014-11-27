var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/status', function (req, res) {
    res.sendFile('index.html', {root: '../public'})
});

module.exports = router;
