// @flow

import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import conduitBookshelf from './base';
import config from '../config';

const ITERATIONS = 10000;
const KEYLEN = 512;
const DIGEST = 'sha512';

const User = conduitBookshelf.Model.extend({
  tableName: 'users',

  validate: {
    bio: ['string'],
    email: ['required', 'email', 'unique:users:email'],
    hash: ['string'],
    image: ['string'],
    salt: ['string'],
    username: ['required', 'string', 'unique:users:username'],
  },

  setPassword(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto
      .pbkdf2Sync(password, this.salt, ITERATIONS, KEYLEN, DIGEST)
      .toString('hex');
  },

  isValidPassword(password) {
    const hash = crypto
      .pbkdf2Sync(password, this.salt, ITERATIONS, KEYLEN, DIGEST)
      .toString('hex');
    return this.hash === hash;
  },

  generateJWT() {
    return jwt.sign(
      {
        id: this.id,
        username: this.username,
      },
      config.get('secret'),
      {expiresIn: '60 days'},
    );
  },

  toAuthJSON() {
    return {
      username: this.username,
      email: this.email,
      token: this.generateJWT(),
      bio: this.bio,
      image: this.image,
    };
  },
});

export default User;
