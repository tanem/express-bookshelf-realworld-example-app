'use strict';

const bookshelf = require('../bookshelf');
const Checkit = require('../checkit');

require('../article/model');
require('../user/model');

const Model = bookshelf.Model.extend({
  tableName: 'favorites',

  hasTimestamps: true,

  validate: {
    article: ['required', 'number'],
    user: ['required', 'number'],
  },

  article() {
    return this.belongsTo('Article', 'article');
  },

  user() {
    return this.belongsTo('User', 'user');
  },

  initialize() {
    this.on('saving', this.handleSaving);
  },

  async handleSaving(model, attrs, options) {
    const checkit = new Checkit(this.validate, {
      messages: {
        required: `can't be blank`,
      },
    });

    await checkit.run(this.attributes, options);
  },
});

module.exports = bookshelf.model('Favorite', Model);
