var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config()
var session = require('express-session');
const { requiresAuth } = require("express-openid-connect");

var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

const { auth } = require('express-openid-connect');

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.auth0_secret,
  baseURL: process.env.auth0_base_url,
  clientID: process.env.auth0_client_id,
  issuerBaseURL: process.env.auth0_issuer_base_url
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));
app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: process.env.session_secret,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))
app.use('/report', express.static(path.join(__dirname, 'snapshots/')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals = {message: err.message, user: req.oidc.user, error:  req.app.get('env') === 'development' ? err : {}}
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
