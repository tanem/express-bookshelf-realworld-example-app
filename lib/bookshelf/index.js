const knex = require('../knex');
const bookshelf = require('bookshelf')(knex);

bookshelf.plugin('virtuals');

module.exports = bookshelf;
