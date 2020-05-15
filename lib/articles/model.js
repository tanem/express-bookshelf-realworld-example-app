'use strict';

const Checkit = require('checkit');
const slug = require('slug');
const {v4: uuidv4} = require('uuid');

module.exports = function Article(bookshelf) {
  return bookshelf.model('Article', {
    tableName: 'articles',

    comments() {
      return this.hasMany('Comment', 'article');
    },

    author() {
      return this.belongsTo('User', 'author');
    },

    favoritedBy() {
      return this.belongsToMany('User').through('Favorite', 'article', 'user');
    },

    tags() {
      return this.belongsToMany('Tag')
        .withPivot(['created_at'])
        .through('ArticleTag', 'article', 'tag');
    },

    getValidators() {
      return {
        author: ['required', 'number'],
        body: ['required', 'string'],
        description: ['required', 'string'],
        slug: ['required', 'string', this.unsafeValidateUnique(['slug'])],
        title: ['required', 'string'],
      };
    },

    initialize() {
      this.on('saving', this.handleSaving);
    },

    async handleSaving(model, attrs, options) {
      if (!this.has('slug')) {
        this.set('slug', this.getSlug());
      }

      const checkit = new Checkit(this.getValidators(), {
        messages: {
          required: `can't be blank`,
        },
      });

      await checkit.run(this.attributes, options);
    },

    getSlug() {
      return slug(`${this.get('title')}-${uuidv4().substr(0, 6)}`, {
        lower: true,
      });
    },
  });
};
