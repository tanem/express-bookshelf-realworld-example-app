'use strict';

const path = require('path');
const requireDirectory = require('require-directory');
const {
  camelCase,
  compose,
  mapValues,
  replace,
  upperFirst,
} = require('lodash/fp');

// When `requireDirectory` is run over the current folder/file structure, it
// will create an object like so:
//
// ```js
// {Article: {Model: {[Function]}}}
// ```
//
// However we want an object like:
//
// ```js
// {Article: {[Function]}}
// ```
//
// So we can do `app.locals.models.Article`. Hence the `mapValues` tweak.
module.exports = (app) => {
  app.locals.models = mapValues(
    (value) => value.Model,
    requireDirectory(module, path.join(__dirname, '..'), {
      include: /\/model\.js$/,
      rename: compose(upperFirst, camelCase, replace(/s\b/g, '')),
      visit: (fn) => fn(app.locals.bookshelf),
    }),
  );
};
