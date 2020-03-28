'use strict';

const {orderBy} = require('lodash/fp');

module.exports = (app) => ({
  async create({tagList, ...restAttributes} = {}, {trx} = {}) {
    const article = await app.locals.models.Article.forge(restAttributes).save(
      null,
      {
        method: 'insert',
        require: true,
        transacting: trx,
      },
    );

    await app.locals.services.articles.tagArticle(article, tagList, {trx});

    return article;
  },

  async fetch(attributes, {trx} = {}) {
    const article = await app.locals.models.Article.forge(attributes).fetch({
      require: true,
      transacting: trx,
    });

    return article;
  },

  async update(article, attributes, {trx} = {}) {
    const updatedArticle = await article.save(attributes, {
      method: 'update',
      patch: true,
      require: true,
      transacting: trx,
    });

    return updatedArticle;
  },

  async del(article, {trx} = {}) {
    const deletedArticle = await article.destroy({
      require: true,
      transacting: trx,
    });

    return deletedArticle;
  },

  async toJSON(article, user, {trx} = {}) {
    await article.load(['author', 'favoritedBy', 'tags'], {transacting: trx});
    return {
      author: await app.locals.services.users.getProfileJSON(
        article.related('author'),
        user,
        {trx},
      ),
      body: article.get('body'),
      createdAt: article.get('created_at'),
      description: article.get('description'),
      favorited: user
        ? article.related('favoritedBy').pluck('id').includes(user.id)
        : false,
      favoritesCount: article.related('favoritedBy').length,
      slug: article.get('slug'),
      tagList: article
        .related('tags')
        .orderBy('_pivot_created_at')
        .pluck('name'),
      title: article.get('title'),
      updatedAt: article.get('updated_at'),
    };
  },

  async getCommentsJSON(article, user, {trx} = {}) {
    await article.load('comments');
    const commentsJSON = await Promise.all(
      article.related('comments').map(async (comment) => {
        const commentJSON = await app.locals.services.comments.toJSON(
          comment,
          user,
          {trx},
        );
        return commentJSON;
      }),
    );
    return orderBy('createdAt', 'desc', commentsJSON);
  },

  async getArticlesJSON(
    {author, favorited, limit = 20, offset = 0, tag} = {},
    user,
    {trx} = {},
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
        transacting: trx,
      });

    const articlesJSON = {
      articles: await Promise.all(
        articles.map(async (article) => {
          const articleJSON = await app.locals.services.articles.toJSON(
            article,
            user,
            {trx},
          );
          return articleJSON;
        }),
      ),
      articlesCount: pagination.rowCount,
    };

    return articlesJSON;
  },

  async getFeedJSON({limit = 20, offset = 0} = {}, user, {trx} = {}) {
    // prettier-ignore
    const {
      models: articles,
      pagination,
    } = await app.locals.models.Article
      .forge()
      .query(qb => {
        qb.andWhereRaw(`
          author in (
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
        transacting: trx,
      });

    const feedJSON = {
      articles: await Promise.all(
        articles.map(async (article) => {
          const articleJSON = await app.locals.services.articles.toJSON(
            article,
            user,
            {trx},
          );
          return articleJSON;
        }),
      ),
      articlesCount: pagination.rowCount,
    };

    return feedJSON;
  },

  async tagArticle(article, tagList = [], {trx} = {}) {
    for (let tagName of tagList) {
      let tag;

      try {
        tag = await app.locals.services.tags.fetch({name: tagName}, {trx});
      } catch (e) {} // eslint-disable-line no-empty

      if (!tag) {
        tag = await app.locals.services.tags.create({name: tagName}, {trx});
      }

      await app.locals.services.articlesTags.create(
        {
          article: article.id,
          tag: tag.id,
        },
        {trx},
      );
    }
  },
});
