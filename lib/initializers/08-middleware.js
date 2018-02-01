'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const path = require('path');
const pino = require('express-pino-logger');
const requireDirectory = require('require-directory');
const config = require('../../config');
const {
  handleBookshelfError,
  handleBoomError,
  handleCheckitError,
  handleError,
  handleRouteNotFoundError,
} = require('../middleware');

// TODO: Add security middleware.
// TODO: Handle pg errors.
module.exports = app => {
  app.use(pino({level: config.get('pino.level')}));

  // Check these. Should they be global?
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));

  // Needed for passport, globally?
  app.use(cookieParser());
  app.use(passport.initialize());

  requireDirectory(module, path.join(__dirname, '..'), {
    // TODO: Correct this once chaos is reigned in.
    // include: /router\.js$/,
    include: /router\.js$/,
    visit: router => app.use(router),
  });

  app.use(handleRouteNotFoundError);

  app.use(handleCheckitError);
  app.use(handleBookshelfError);
  app.use(handleBoomError);
  app.use(handleError);
};
