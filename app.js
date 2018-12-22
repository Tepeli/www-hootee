"use strict";

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var Promise = require("bluebird");
var passport = require('passport');
var flash    = require('connect-flash');
var morgan       = require('morgan');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var compression = require('compression');
var helmet = require('helmet');

// Define routers
var indexRouter = require('./routes/index');
var postsRouter = require('./routes/posts');
var scoresRouter = require('./routes/scores');

var app = express();

app.use(helmet());

// Set up mongoose connection
var mongoose = require('mongoose');
// For local dev
// var dev_db_url = 'mongodb://localhost:27017'
var dev_db_url = 'mongodb://mongo:27017'
var mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

require('./config/passport')(passport); // pass passport for configuration

app.use(compression()); //Compress all routes

// set up our express application
app.use(bodyParser()); // get information from html forms

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('view engine', 'ejs'); // set up ejs for templating

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.static(path.join('posts', 'public')));

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport

// Use the routes
app.use('/', indexRouter);
app.use('/posts', postsRouter);
app.use('/scores', scoresRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error.pug');
});

module.exports = app;
