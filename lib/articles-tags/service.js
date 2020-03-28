'use strict';

module.exports = (app) => ({
  async create(attributes, {trx} = {}) {
    const articleTag = await app.locals.models.ArticleTag.forge(
      attributes,
    ).save(null, {
      method: 'insert',
      require: true,
      transacting: trx,
    });
    return articleTag;
  },
});
