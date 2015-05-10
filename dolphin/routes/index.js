var express = require('express');
var router = express.Router();
var eventsOrchestrator = require('../lib/events/orchestrator');

var orchestrator = new eventsOrchestrator.Dolphin.Events.Orchestrator();

router.post('/api', function(req, res) {
  orchestrator.orchestrate(req, res);
});

var handler = function (req, res) {
  res.sendFile('index.html', {root: '../public'})
};

/* GET home page. */
router.get('/', handler);

module.exports = router;
