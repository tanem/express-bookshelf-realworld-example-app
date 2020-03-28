'use strict';

const Checkit = require('checkit');

module.exports = (bookshelf) =>
  bookshelf.model('Comment', {
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
  });
