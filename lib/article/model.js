'use strict';

const slug = require('slug');
const uuidv4 = require('uuid/v4');
const Checkit = require('../checkit');
const bookshelf = require('../bookshelf');

require('../favorite/model');
require('../user/model');

const Model = bookshelf.Model.extend({
  tableName: 'articles',

  hasTimestamps: true,

  author() {
    return this.belongsTo('User', 'author');
  },

  favoritedBy() {
    return this.belongsToMany('User').through('Favorite', 'article', 'user');
  },

  validate: {
    author: ['required', 'number'],
    body: ['string'],
    description: ['string'],
    // favoritesCount: ['number'],
    slug: ['required', 'string', 'unsafeUnique:articles:slug'],
    title: ['string'],
  },

  initialize() {
    this.on('saving', this.handleSaving);
  },

  async handleSaving(model, attrs, options) {
    if (!this.has('slug')) {
      this.set('slug', this.getSlug());
    }

    const checkit = new Checkit(this.validate, {
      messages: {
        required: `can't be blank`,
      },
    });

    await checkit.run(this.attributes, options);
  },

  getSlug() {
    return slug(`${this.get('title')}-${uuidv4().substr(0, 6)}`, {lower: true});
  },

  isFavorited() {
    return this.relations.favoritedBy.length > 0;
  },

  getFavoritesCount() {
    return this.relations.favoritedBy.length;
  },

  // TODO: toJSON?
  // TODO: Why pass the user?
  // TODO: User model favorites count.
  getJSON(user) {
    return {
      author: this.relations.author.getProfileJSON(user),
      body: this.get('body'),
      createdAt: this.get('created_at'),
      description: this.get('description'),
      favorited: this.isFavorited(),
      favoritesCount: this.getFavoritesCount(),
      slug: this.get('slug'),
      tagList: this.get('tagList'),
      title: this.get('title'),
      updatedAt: this.get('updated_at'),
    };
  },
});

module.exports = bookshelf.model('Article', Model);
