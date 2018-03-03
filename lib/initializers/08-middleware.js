'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
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
  handlePostgresUniqueError,
  handleRouteNotFoundError,
  rollbackTransaction
} = require('../middleware');

// TODO: Add security middleware.
module.exports = app => {
  app.use(pino({level: config.get('pino.level')}));

  app.disable('x-powered-by');

  app.use(cors());

  // Check these. Should they be global?
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: false}));

  // Needed for passport, globally?
  app.use(cookieParser());
  app.use(passport.initialize());

  requireDirectory(module, path.join(__dirname, '..'), {
    include: /router\.js$/,
    visit: router => app.use(router),
  });

  app.use(handleRouteNotFoundError);

  app.use(rollbackTransaction);
  app.use(handleCheckitError);
  app.use(handleBookshelfError);
  app.use(handlePostgresUniqueError);
  app.use(handleBoomError);
  app.use(handleError);
};
