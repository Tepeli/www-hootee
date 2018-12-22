"use strict";

var Score = require('../models/score');
var async = require('async');
// Good validation documentation available at https://express-validator.github.io/docs/
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all scores.
exports.index = function(req, res, next) {
  Score.find({}).exec(function (err, list_scores) {
    if (err) { return next(err); }
    // See more at https://expressjs.com/en/api.html#res.format
    res.format({
      'text/html': function(){
    res.render('index.ejs');
      },
      'application/json': function(){
        res.json(list_scores);
      },
      'default': function(){
        // log the request and respond with 406
        res.status(406).send('Not Acceptable');
      }
    });
  });

};

// New score creation
exports.create = function(req, res, next) {
  sanitizeBody('*').trim().escape();
  if (req.user === undefined) {
    res.redirect('/login');
  }
  // Create a score object
  // Improve: Use promises with .then()
  var newScore = req.body;
  if (req.user.local.email) {
    newScore["user"] = req.user.local.email;
  } else if (req.user.facebook.name) {
    newScore["user"] = req.user.facebook.name;
  }
  console.log("useri: "+req.user.local.email+" tai "+ req.user.facebook.name);
  console.log("scorei: "+newScore);
  var score = new Score(
    newScore
  );

    score.save(function (err) {
      if (err) { return next(err); }
      // Successful - redirect to new book record.
      res.send('success');
    });
  };
