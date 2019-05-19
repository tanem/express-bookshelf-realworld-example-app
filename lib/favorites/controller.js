'use strict';

const errorCatcher = require('async-error-catcher').default;

exports.favorite = errorCatcher(async (req, res) => {
  const {user} = req;
  const {
    app: {
      locals: {
        services: {articles, favorites},
      },
    },
    locals: {article, trx} = {},
  } = res;

  await favorites.create({user: user.id, article: article.id}, {trx});

  res.json({article: await articles.toJSON(article, user, {trx})});
});

exports.unfavorite = errorCatcher(async (req, res) => {
  const {user} = req;
  const {
    app: {
      locals: {
        services: {articles, favorites},
      },
    },
    locals: {article, trx} = {},
  } = res;

  const favorite = await favorites.fetch(
    {user: user.id, article: article.id},
    {trx},
  );
  await favorites.del(favorite, {trx});

  res.json({article: await articles.toJSON(article, user, {trx})});
});
