'use strict'

module.exports = app => {
  const bookshelf = require('bookshelf')(app.locals.knex)

  bookshelf.plugin('virtuals')
  bookshelf.plugin('registry')
  bookshelf.plugin('pagination')

  app.locals.bookshelf = bookshelf
}
