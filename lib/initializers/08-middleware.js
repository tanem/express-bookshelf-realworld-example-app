'use strict';

const cors = require('cors');
const helmet = require('helmet');
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
  rollbackTransaction,
} = require('../middleware');

module.exports = (app) => {
  app.use(helmet());
  app.use(cors());
  app.use(pino({level: config.get('pino.level')}));
  app.use(passport.initialize());

  requireDirectory(module, path.join(__dirname, '..'), {
    include: /router\.js$/,
    visit: (router) => app.use(router),
  });

  app.use(handleRouteNotFoundError);

  app.use(rollbackTransaction);
  app.use(handleCheckitError);
  app.use(handleBookshelfError);
  app.use(handlePostgresUniqueError);
  app.use(handleBoomError);
  app.use(handleError);
};
