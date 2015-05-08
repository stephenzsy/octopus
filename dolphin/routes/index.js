var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var handler = function (req, res) {
    res.sendFile('index.html', {root: '../public'})
  };

  router.get('/', handler);
});

module.exports = router;
