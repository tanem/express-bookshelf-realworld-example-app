'use strict';

module.exports = app => ({
  async create(attributes, options = {}) {
    const follower = await app.locals.models.Follower.forge(attributes).save(
      null,
      {
        ...options,
        method: 'insert',
        require: true,
      },
    );
    return follower;
  },

  async fetch(attributes, options = {}) {
    const follower = await app.locals.models.Follower.forge(attributes).fetch({
      ...options,
      require: true,
    });
    return follower;
  },

  async del(follower, options = {}) {
    const deletedFollower = await follower.destroy({...options, require: true});
    return deletedFollower;
  },
});
