'use strict';

const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = app => ({
  async create(attributes, options = {}) {
    const user = await app.locals.models.User.forge(attributes).save(null, {
      ...options,
      method: 'insert',
      require: true,
    });
    return user;
  },

  async fetch(attributes, options = {}) {
    const user = await app.locals.models.User.forge(attributes).fetch({
      ...options,
      require: true,
    });
    return user;
  },

  async update(user, attributes, options = {}) {
    const updatedUser = await user.save(attributes, {
      ...options,
      method: 'update',
      patch: true,
      require: true,
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

  getAuthJSON(user) {
    return {
      bio: user.get('bio'),
      email: user.get('email'),
      image: user.get('image'),
      token: this.generateJWT(user),
      username: user.get('username'),
    };
  },

  // Returns profile JSON for `user`. If `authenticatedUser` is passed, will
  // indicate whether or not they are following `user`.
  async getProfileJSON(user, authenticatedUser) {
    let isAuthenticatedUserFollowing = false;

    if (authenticatedUser) {
      await authenticatedUser.load(['following']);
      isAuthenticatedUserFollowing = authenticatedUser
        .related('following')
        .some(({id}) => id === user.id);
    }

    return {
      bio: user.get('bio'),
      following: isAuthenticatedUserFollowing,
      // TODO: Not sure about that fallback...
      image:
        user.get('image') ||
        'https://static.productionready.io/images/smiley-cyrus.jpg',
      username: user.get('username'),
    };
  },
});
