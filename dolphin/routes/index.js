var express = require('express');
var router = express.Router();
var eventsOrchestrator = require('../app/orchestrator');

var orchestrator = new eventsOrchestrator.Dolphin.Events.Orchestrator();

'use strict';

router.post('/api', function (req, res) {
    try {
        orchestrator.orchestrate(req, res);
    } catch (e) {
        console.error(e);
        console.log(e.stack);
        throw e;
    }
});

var handler = function (req, res) {
    res.sendFile('index.html', {root: __dirname + '/../public'});
};

/* GET home page. */
router.all('*', handler);

module.exports = router;
