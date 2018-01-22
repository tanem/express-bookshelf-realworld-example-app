'use strict';

const errorCatcher = require('async-error-catcher').default;

exports.favorite = errorCatcher(async (req, res) => {
  const {user} = req;
  const {
    app: {locals: {services: {articles, favorites}}},
    locals: {article} = {},
  } = res;

  await favorites.create({user: user.id, article: article.id});

  res.json({article: await articles.toJSON(article, user)});
});

exports.unfavorite = errorCatcher(async (req, res) => {
  const {user} = req;
  const {
    app: {locals: {services: {articles, favorites}}},
    locals: {article} = {},
  } = res;

  const favorite = await favorites.show({user: user.id, article: article.id});
  await favorite.destroy();

  res.json({article: await articles.toJSON(article, user)});
});
