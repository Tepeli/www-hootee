"use strict";

var express = require('express');
var router = express.Router();

// Require controllers
var post_controller = require('../controllers/postController');

// GET post listing page
router.get('/', post_controller.index);

// POST request for creating a new post
router.post('/create', post_controller.create);

// router.delete('/delete:id', post_controller.delete);

// POST request to delete Book.
router.post('/:id/delete', post_controller.delete);



module.exports = router;
