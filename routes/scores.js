"use strict";

var express = require('express');
var router = express.Router();

// Require controllers
var score_controller = require('../controllers/scoreController');

// GET post listing page
router.get('/', score_controller.index);

// POST request for creating a new post
router.post('/create', score_controller.create);

module.exports = router;
