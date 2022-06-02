'use strict';

const path = require('path');
const requireDirectory = require('require-directory');
const camelCase = require('lodash/fp/camelCase');
const mapValues = require('lodash/fp/mapValues');

// We want an object shape that allows `app.locals.services.user.create`. See
// comments in `**-model-registry.js`.
module.exports = (app) => {
  app.locals.services = mapValues(
    (value) => value.service,
    requireDirectory(module, path.join(__dirname, '..'), {
      include: /\/service\.js$/,
      rename: camelCase,
      visit: (fn) => fn(app),
    }),
  );
};
