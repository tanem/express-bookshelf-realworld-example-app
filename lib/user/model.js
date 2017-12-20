const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {isString} = require('lodash');
const Checkit = require('../checkit');
const bookshelf = require('../bookshelf');
const config = require('../config');

// TODO: Boom errors.
// TODO: Handle PostgreSQL errors (e.g. unique validation).
// TODO: Handle app errors - expand validation middleware.

const Model = bookshelf.Model.extend({
  tableName: 'users',

  hasTimestamps: true,

  validate: {
    bio: ['string'],
    email: ['required', 'email', 'unsafeUnique:users:email'],
    encryptedPassword: ['string'],
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
    this.on('saving', this.validateSave);
  },

  async validateSave(model, attrs, options) {
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
      config.get('env') === 'test'
        ? {noTimestamp: true}
        : {expiresIn: '60 days'},
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
});

module.exports = Model;
