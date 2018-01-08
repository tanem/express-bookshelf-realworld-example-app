'use strict';

const Checkit = require('checkit');
const bookshelf = require('../bookshelf');

const Model = bookshelf.Model.extend({
  tableName: 'comments',

  getValidators() {
    return {
      article: ['required', 'number'],
      author: ['required', 'number'],
      body: ['required', 'string'],
    };
  },

  article() {
    return this.belongsTo('Article', 'article');
  },

  author() {
    return this.belongsTo('User', 'author');
  },

  initialize() {
    this.on('saving', this.handleSaving);
  },

  async handleSaving(model, attrs, options) {
    const checkit = new Checkit(this.getValidators(), {
      messages: {
        required: `can't be blank`,
      },
    });

    await checkit.run(this.attributes, options);
  },

  toJSONFor(user) {
    return {
      author: this.relations.author.toProfileJSONFor(user),
      body: this.get('body'),
      createdAt: this.get('created_at'),
      id: this.id,
      updatedAt: this.get('updated_at'),
    };
  },
});

module.exports = bookshelf.model('Comment', Model);
