'use strict';

const bcrypt = require('bcrypt');
const Checkit = require('checkit');
const {isString} = require('lodash/fp');

module.exports = (bookshelf) =>
  bookshelf.model('User', {
    tableName: 'users',

    comments() {
      return this.hasMany('Comment', 'author');
    },

    articles() {
      return this.hasMany('Article', 'author');
    },

    following() {
      return this.belongsToMany('User').through('Follower', 'follower', 'user');
    },

    followers() {
      return this.belongsToMany('User').through('Follower', 'user', 'follower');
    },

    favorites() {
      return this.belongsToMany('Article').through(
        'Favorite',
        'user',
        'article',
      );
    },

    getValidators() {
      return {
        bio: ['string'],
        email: ['required', 'email', this.unsafeValidateUnique(['email'])],
        image: ['string'],
        username: [
          'required',
          'string',
          'alphaNumeric',
          this.unsafeValidateUnique(['username']),
        ],
      };
    },

    getMaybeValidators() {
      return {
        password: ['required', 'string'],
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
  });
