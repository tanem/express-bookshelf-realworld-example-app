'use strict';

module.exports = (app) => {
  const bookshelf = require('bookshelf')(app.locals.knex);
  bookshelf.plugin('bookshelf-virtuals-plugin');
  app.locals.bookshelf = bookshelf;
};
