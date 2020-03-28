'use strict';

module.exports = (app) => ({
  async create(attributes, {trx} = {}) {
    const follower = await app.locals.models.Follower.forge(attributes).save(
      null,
      {
        method: 'insert',
        require: true,
        transacting: trx,
      },
    );
    return follower;
  },

  async fetch(attributes, {trx} = {}) {
    const follower = await app.locals.models.Follower.forge(attributes).fetch({
      require: true,
      transacting: trx,
    });
    return follower;
  },

  async del(follower, {trx} = {}) {
    const deletedFollower = await follower.destroy({
      require: true,
      transacting: trx,
    });
    return deletedFollower;
  },
});
