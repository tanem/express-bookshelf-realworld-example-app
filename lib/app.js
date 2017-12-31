'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const express = require('express');
const passport = require('passport');
const pino = require('express-pino-logger');
const config = require('./config');
const {router: userRouter} = require('./user');
const {router: profileRouter} = require('./profile');
const {router: articleRouter} = require('./article');
const favoriteRouter = require('./favorite/router');
const {
  handleBoomError,
  handleCheckitError,
  handleError,
  handleNotFoundError,
  handleTokenError,
} = require('./middleware');

// const path = require('path');
// const favicon = require('serve-favicon');

require('./passport/configure');

const app = express();

app.use(
  pino({
    level: config.get('pino.level'),
  }),
);

// Uncomment after placing your favicon in /public.
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

// TODO: Add helmet.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());

app.use(userRouter);
app.use(profileRouter);
app.use(articleRouter);
app.use(favoriteRouter);

app.use(handleNotFoundError);
app.use(handleTokenError);
app.use(handleCheckitError);
// TODO: handleDBError (e.g. Postgres unique constraint violation).
app.use(handleBoomError);
app.use(handleError);

module.exports = app;
