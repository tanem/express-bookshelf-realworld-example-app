const knex = require('../knex');
const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('virtuals');
bookshelf.plugin('registry');

module.exports = bookshelf;
