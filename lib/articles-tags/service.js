'use strict';

module.exports = app => ({
  async create(attributes, options = {}) {
    const articleTag = await app.locals.models.ArticleTag.forge(
      attributes,
    ).save(null, {
      ...options,
      method: 'insert',
      require: true,
    });
    return articleTag;
  },
});
