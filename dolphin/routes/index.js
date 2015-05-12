var express = require('express');
var router = express.Router();
var eventsOrchestrator = require('../lib/events/orchestrator');

var orchestrator = new eventsOrchestrator.Dolphin.Events.Orchestrator();

'use strict';

router.post('/api', function (req, res) {
    try {
        orchestrator.orchestrate(req, res);
    } catch (e) {
        console.error(e);
        throw e;
    }
});

var handler = function (req, res) {
    res.sendFile('index.html', {root: __dirname + '/../public'});
};

/* GET home page. */
router.all('*', handler);

module.exports = router;
