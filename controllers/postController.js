"use strict";

var Post = require('../models/post');
var async = require('async');
// Good validation documentation available at https://express-validator.github.io/docs/
const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Display list of all posts.
exports.index = function(req, res, next) {
  Post.find({}).exec(function (err, list_posts) {
    if (err) { return next(err); }
    // See more at https://expressjs.com/en/api.html#res.format
    res.format({
      'text/html': function(){
    res.render('index.ejs');
      },
      'application/json': function(){
        res.json(list_posts);
      },
      'default': function(){
        // log the request and respond with 406
        res.status(406).send('Not Acceptable');
      }
    });
  });

};

// Handle book create on POST.
exports.create = function(req, res, next) {
  sanitizeBody('*').trim().escape();
  if (req.user === undefined) {
    res.redirect('/login');
  }
  // Create a post object
  // Improve: Use promises with .then()
  var newPost = req.body;
  if (req.user.local.email) {
    newPost["user"] = req.user.local.email;
  } else if (req.user.facebook.name) {
    newPost["user"] = req.user.facebook.name;
  }
  console.log("useri: "+req.user.local.email+" tai "+ req.user.facebook.name);
  console.log("posti: "+newPost);
  var post = new Post(
    newPost
  );

    post.save(function (err) {
      if (err) { return next(err); }
      // Successful - redirect to new book record.
      res.send('success');
    });
  };

  exports.delete = function(req, res, next) {
      sanitizeBody('*').trim().escape();
      if (req.user === undefined) {
        res.redirect('/login');
      }
      // Delete only own posts
      Post.findById(req.params.id, function(error, post) {
        if (post !== null) {
          if (post.user && req.user.local.email) {
            if (post.user === req.user.local.email) {
              post.remove();
            }
          } else if (post.user && req.user.facebook.name) {
            if (post.user === req.user.facebook.name) {
              post.remove();
            }
          }
        }

        if(error) {
          res.json(error);
        } else {
          res.redirect('/list');
        }
	    });
  };
