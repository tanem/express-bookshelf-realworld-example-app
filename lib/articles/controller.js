'use strict';

const errorCatcher = require('async-error-catcher').default;

exports.create = errorCatcher(async (req, res) => {
  const {body: {article: payload} = {}, user} = req;
  const {
    app: {
      locals: {
        services: {articles},
      },
    },
    locals: {trx},
  } = res;

  const article = await articles.create({...payload, author: user.id}, {trx});

  res.status(201).json({
    article: await articles.toJSON(article, user, {trx}),
  });
});

exports.del = errorCatcher(async (req, res) => {
  const {
    app: {
      locals: {
        services: {articles},
      },
    },
    locals: {article, trx} = {},
  } = res;

  await articles.del(article, {trx});

  res.sendStatus(200);
});

exports.feed = errorCatcher(async (req, res) => {
  const {query: {limit, offset} = {}, user} = req;
  const {
    app: {
      locals: {
        services: {articles},
      },
    },
  } = res;

  const feedJSON = await articles.getFeedJSON(
    {
      limit,
      offset,
    },
    user,
  );

  res.json(feedJSON);
});

exports.index = errorCatcher(async (req, res) => {
  const {query: {author, favorited, limit, offset, tag} = {}, user} = req;
  const {
    app: {
      locals: {
        services: {articles},
      },
    },
  } = res;

  const articlesJSON = await articles.getArticlesJSON(
    {
      author,
      favorited,
      limit,
      offset,
      tag,
    },
    user,
  );

  res.json(articlesJSON);
});

exports.show = errorCatcher(async (req, res) => {
  const {user} = req;
  const {
    app: {
      locals: {
        services: {articles},
      },
    },
    locals: {article} = {},
  } = res;

  res.json({article: await articles.toJSON(article, user)});
});

exports.update = errorCatcher(async (req, res) => {
  const {body: {article: payload} = {}, user} = req;
  const {
    app: {
      locals: {
        services: {articles},
      },
    },
    locals: {article, trx} = {},
  } = res;

  const updatedArticle = await articles.update(article, payload, {trx});

  res.json({article: await articles.toJSON(updatedArticle, user, {trx})});
});
