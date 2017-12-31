'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {isString} = require('lodash/fp');
const Checkit = require('../checkit');
const bookshelf = require('../bookshelf');
const config = require('../config');

require('../favorite/model');
require('../article/model');

const Model = bookshelf.Model.extend({
  tableName: 'users',

  hasTimestamps: true,

  articles() {
    return this.hasMany('Article', 'author');
  },

  favorites() {
    return this.belongsToMany('Article').through('Favorite', 'user', 'article');
  },

  validate: {
    bio: ['string'],
    email: ['required', 'email', 'unsafeUnique:users:email'],
    image: ['string'],
    username: ['required', 'string', 'unsafeUnique:users:username'],
  },

  validateMaybe: {
    password: ['required', 'string', 'minLength:8'],
  },

  virtuals: {
    password: {
      get() {},
      set(password) {
        this._password = password;
      },
    },
  },

  initialize() {
    this.on('saving', this.handleSaving);
  },

  async handleSaving(model, attrs, options) {
    const validatePassword = this.isNew() || isString(this._password);

    const checkit = new Checkit(this.validate, {
      messages: {
        required: `can't be blank`,
      },
    });

    checkit.maybe(this.validateMaybe, () => validatePassword);

    await checkit.run(
      {
        ...this.attributes,
        password: this._password,
      },
      options,
    );

    if (validatePassword) {
      const hashedPassword = await bcrypt.hash(this._password, 12);
      this.set('hashed_password', hashedPassword);
      delete this._password;
    }
  },

  async isValidPassword(password) {
    return await bcrypt.compare(password, this.get('hashed_password'));
  },

  generateJWT() {
    return jwt.sign(
      {
        id: this.id,
        username: this.get('username'),
      },
      config.get('secret'),
      {expiresIn: '60 days'},
    );
  },

  getAuthJSON() {
    return {
      bio: this.get('bio'),
      email: this.get('email'),
      image: this.get('image'),
      token: this.generateJWT(),
      username: this.get('username'),
    };
  },

  // TODO: Ditch this exclusion once we start using `user`.
  // eslint-disable-next-line no-unused-vars
  getProfileJSON(user) {
    return {
      bio: this.get('bio'),
      following: false,
      // TODO: Not sure about that fallback...
      image:
        this.get('image') ||
        'https://static.productionready.io/images/smiley-cyrus.jpg',
      username: this.get('username'),
    };
  },
});

module.exports = bookshelf.model('User', Model);
