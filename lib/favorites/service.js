'use strict';

module.exports = (app) => ({
  async create(attributes, {trx} = {}) {
    const favorite = await app.locals.models.Favorite.forge(attributes).save(
      null,
      {
        method: 'insert',
        require: true,
        transacting: trx,
      },
    );
    return favorite;
  },

  async fetch(attributes, {trx} = {}) {
    const favorite = await app.locals.models.Favorite.forge(attributes).fetch({
      require: true,
      transacting: trx,
    });
    return favorite;
  },

  async del(favorite, {trx} = {}) {
    const deletedFavorite = await favorite.destroy({
      require: true,
      transacting: trx,
    });
    return deletedFavorite;
  },
});
