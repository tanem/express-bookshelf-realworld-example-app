const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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
    password: ['required', 'string', 'minLength:8'],
    username: ['required', 'string', 'unsafeUnique:users:username'],
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
    await Checkit(this.validate, {
      messages: {
        required: `can't be blank`,
      },
    }).run({...this.attributes, ...{password: this._password}}, options);
    const hashedPassword = await bcrypt.hash(this._password, 12);
    this.set('hashed_password', hashedPassword);
    delete model._password;
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
});

module.exports = Model;
