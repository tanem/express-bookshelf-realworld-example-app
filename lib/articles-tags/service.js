'use strict';

module.exports = ({locals: {models: {ArticleTag}}}) => ({
  async create(attributes, options = {}) {
    const articleTag = await ArticleTag.forge(attributes).save(null, {
      ...options,
      method: 'insert',
      require: true,
    });
    return articleTag;
  },
});
