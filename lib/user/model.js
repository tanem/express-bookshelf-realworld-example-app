'use strict';

const bcrypt = require('bcrypt');
const Checkit = require('checkit');
const jwt = require('jsonwebtoken');
const {isString} = require('lodash/fp');
const bookshelf = require('../bookshelf');
const config = require('../../config');

const Model = bookshelf.Model.extend({
  tableName: 'users',

  comments() {
    return this.hasMany('Comment', 'author');
  },

  articles() {
    return this.hasMany('Article', 'author');
  },

  following() {
    return this.belongsToMany('User').through('Follow', 'follower', 'user');
  },

  followers() {
    return this.belongsToMany('User').through('Follow', 'user', 'follower');
  },

  favorites() {
    return this.belongsToMany('Article').through('Favorite', 'user', 'article');
  },

  getValidators() {
    return {
      bio: ['string'],
      email: ['required', 'email', this.unsafeValidateUnique(['email'])],
      image: ['string'],
      username: ['required', 'string', this.unsafeValidateUnique(['username'])],
    };
  },

  getMaybeValidators() {
    return {
      password: [
        'required',
        'string',
        {rule: 'minLength:8', message: 'must be at least 8 characters long'},
      ],
    };
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

    const checkit = new Checkit(this.getValidators(), {
      messages: {
        required: `can't be blank`,
      },
    });

    checkit.maybe(this.getMaybeValidators(), () => validatePassword);

    /*
    What about this?
    Will get rid of that hideous middleware func?
    try {
      await checkit.run..
    } catch (e) {
      throw Boom.badData('', {
        errors...
      })
    }
    */

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

  toProfileJSONFor(user) {
    return {
      bio: this.get('bio'),
      following: user
        ? user.related('following').some(({id}) => id === this.id)
        : false,
      // TODO: Not sure about that fallback...
      image:
        this.get('image') ||
        'https://static.productionready.io/images/smiley-cyrus.jpg',
      username: this.get('username'),
    };
  },
});

module.exports = bookshelf.model('User', Model);
