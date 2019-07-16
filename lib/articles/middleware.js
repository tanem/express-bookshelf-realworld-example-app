'use strict';

const Boom = require('@hapi/boom');
const errorCatcher = require('async-error-catcher').default;

exports.isArticleAuthor = errorCatcher(async (req, res, next) => {
  const {user} = req;
  const {locals: {article} = {}} = res;

  if (article.get('author') !== user.id) {
    throw Boom.forbidden();
  }

  next();
});
