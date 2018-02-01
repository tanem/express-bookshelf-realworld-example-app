'use strict';

module.exports = app => ({
  async create(attributes, options = {}) {
    const favorite = await app.locals.models.Favorite.forge(attributes).save(
      null,
      {
        ...options,
        method: 'insert',
        require: true,
      },
    );
    return favorite;
  },

  async fetch(attributes, options = {}) {
    const favorite = await app.locals.models.Favorite.forge(attributes).fetch({
      ...options,
      require: true,
    });
    return favorite;
  },

  async del(favorite, options = {}) {
    const deletedFavorite = await favorite.destroy({...options, require: true});
    return deletedFavorite;
  },
});
