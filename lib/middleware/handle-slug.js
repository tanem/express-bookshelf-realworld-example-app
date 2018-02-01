'use strict';

const errorCatcher = require('async-error-catcher').default;

module.exports = errorCatcher(async (req, res, next) => {
  const {app: {locals: {services: {articles}}}, params: {slug} = {}} = req;

  const article = await articles.fetch({slug});
  res.locals.article = article;

  next();
});
