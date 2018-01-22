'use strict';

module.exports = ({locals: {models: {Article}}}) => ({
  async create(attributes, options = {}) {
    const article = await Article.forge(attributes).save(null, {
      ...options,
      method: 'insert',
      require: true,
    });
    return article;
  },

  async show(attributes, options = {}) {
    const article = await Article.forge(attributes).fetch({
      ...options,
      require: true,
    });
    return article;
  },

  async update(article, attributes, options = {}) {
    const updatedArticle = await article.save(attributes, {
      ...options,
      method: 'update',
      patch: true,
      require: true,
    });
    return updatedArticle;
  },

  async del(article, options = {}) {
    const deletedArticle = await article.destroy({...options, require: true});
    return deletedArticle;
  },

  async toJSON(article, user) {
    await article.load(['author', 'favoritedBy', 'tags']);
    return {
      author: article.related('author').toProfileJSONFor(user),
      body: article.get('body'),
      createdAt: article.get('created_at'),
      description: article.get('description'),
      favorited: article.related('favoritedBy').length > 0,
      favoritesCount: article.related('favoritedBy').length,
      slug: article.get('slug'),
      tagList: article.related('tags').pluck('name'),
      title: article.get('title'),
      updatedAt: article.get('updated_at'),
    };
  },

  async getComments(article) {
    await article.load('comments');
    return article.related('comments');
  },
});
