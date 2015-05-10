var express = require('express');
var router = express.Router();
var eventsOrchestrator = require('../lib/events/orchestrator');

var orchestrator = new eventsOrchestrator.Dolphin.Events.Orchestrator();

/* GET home page. */
router.get('/', function(req, res, next) {
  var handler = function (req, res) {
    res.sendFile('index.html', {root: '../public'})
  };

  router.post('/api', orchestrator.orchestrate);
  router.get('/', handler);
});

module.exports = router;
