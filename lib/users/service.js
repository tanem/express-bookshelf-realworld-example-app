'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = (app) => ({
  async create(attributes, {trx} = {}) {
    const user = await app.locals.models.User.forge(attributes).save(null, {
      method: 'insert',
      require: true,
      transacting: trx,
    });
    return user;
  },

  async fetch(attributes, {trx} = {}) {
    const user = await app.locals.models.User.forge(attributes).fetch({
      require: true,
      transacting: trx,
    });
    return user;
  },

  async update(user, attributes, {trx} = {}) {
    const updatedUser = await user.save(attributes, {
      method: 'update',
      patch: true,
      require: true,
      transacting: trx,
    });
    return updatedUser;
  },

  generateJWT(user) {
    return jwt.sign(
      {
        id: user.id,
        username: user.get('username'),
      },
      config.get('secret'),
      {expiresIn: '60 days'},
    );
  },

  getAuthJSON(user, token) {
    return {
      bio: user.get('bio'),
      email: user.get('email'),
      image: user.get('image'),
      token: token || this.generateJWT(user),
      username: user.get('username'),
    };
  },

  // Returns profile JSON for `user`. If `authenticatedUser` is passed, will
  // indicate whether or not they are following `user`.
  async getProfileJSON(user, authenticatedUser, {trx} = {}) {
    let isAuthenticatedUserFollowing = false;

    if (authenticatedUser) {
      await authenticatedUser.load('following', {transacting: trx});
      isAuthenticatedUserFollowing = authenticatedUser
        .related('following')
        .some(({id}) => id === user.id);
    }

    return {
      bio: user.get('bio'),
      following: isAuthenticatedUserFollowing,
      image:
        user.get('image') ||
        'https://static.productionready.io/images/smiley-cyrus.jpg',
      username: user.get('username'),
    };
  },
});
