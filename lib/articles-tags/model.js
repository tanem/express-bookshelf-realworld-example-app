'use strict';

const Checkit = require('checkit');

module.exports = (bookshelf) =>
  bookshelf.model('ArticleTag', {
    tableName: 'articles_tags',

    getValidators() {
      return {
        article: [
          'required',
          'number',
          this.unsafeValidateUnique(['article', 'tag'], 'is already tagged'),
        ],
        tag: ['required', 'number'],
      };
    },

    article() {
      return this.belongsTo('Article', 'article');
    },

    tag() {
      return this.belongsTo('Tag', 'tag');
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
