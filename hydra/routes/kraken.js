var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    console.dir(req);
    res.send('');
});

module.exports = router;
