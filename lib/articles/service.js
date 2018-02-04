'use strict';

module.exports = app => ({
  async create(attributes, options = {}) {
    const article = await app.locals.models.Article.forge(attributes).save(
      null,
      {
        ...options,
        method: 'insert',
        require: true,
      },
    );
    return article;
  },

  async fetch(attributes, options = {}) {
    const article = await app.locals.models.Article.forge(attributes).fetch({
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
      author: await app.locals.services.users.getProfileJSON(
        article.related('author'),
        user,
      ),
      body: article.get('body'),
      createdAt: article.get('created_at'),
      description: article.get('description'),
      favorited: user
        ? article
            .related('favoritedBy')
            .pluck('id')
            .includes(user.id)
        : false,
      favoritesCount: article.related('favoritedBy').length,
      slug: article.get('slug'),
      tagList: article.related('tags').pluck('name'),
      title: article.get('title'),
      updatedAt: article.get('updated_at'),
    };
  },

  async getCommentsJSON(article, user) {
    await article.load('comments');
    const commentsJSON = await Promise.all(
      article.related('comments').map(async comment => {
        const commentJSON = await app.locals.services.comments.toJSON(
          comment,
          user,
        );
        return commentJSON;
      }),
    );
    return commentsJSON;
  },

  async getArticlesJSON(
    {author, favorited, limit = 20, offset = 0, tag} = {},
    user,
  ) {
    // prettier-ignore
    const {
      models: articles,
      pagination,
    } = await app.locals.models.Article
      .forge()
      .query(qb => {
        if (author) {
          qb.andWhereRaw(`
            author = (
              SELECT id
              FROM users
              WHERE username = ?
            )
          `, [author]);
        }

        if (favorited) {
          qb.andWhereRaw(`
            id IN (
              SELECT article
              FROM favorites
              WHERE favorites.user = (
                SELECT id
                FROM users
                WHERE username = ?
              )
            )
          `, [favorited]);
        }

        if (tag) {
          qb.andWhereRaw(`
            id IN (
              SELECT article
              FROM articles_tags
              WHERE tag = (
                SELECT id
                FROM tags
                WHERE name = ?
              )
            )
          `, [tag]);
        }
      })
      .orderBy('created_at', 'DESC')
      .fetchPage({
        limit,
        offset,
      });

    const articlesJSON = {
      articles: await Promise.all(
        articles.map(async article => {
          const articleJSON = await app.locals.services.articles.toJSON(
            article,
            user,
          );
          return articleJSON;
        }),
      ),
      articlesCount: pagination.rowCount,
    };

    return articlesJSON;
  },

  async getFeedJSON({limit = 20, offset = 0} = {}, user) {
    // prettier-ignore
    const {
      models: articles,
      pagination,
    } = await app.locals.models.Article
      .forge()
      .query(qb => {
        qb.andWhereRaw(`
          author = (
            SELECT followers.user
            FROM followers
            WHERE followers.follower = ?
          )
        `, [user.id]);
      })
      .orderBy('created_at', 'DESC')
      .fetchPage({
        limit,
        offset,
      });

    const feedJSON = {
      articles: await Promise.all(
        articles.map(async article => {
          const articleJSON = await app.locals.services.articles.toJSON(
            article,
            user,
          );
          return articleJSON;
        }),
      ),
      articlesCount: pagination.rowCount,
    };

    return feedJSON;
  },
});
