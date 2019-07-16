'use strict';

const Boom = require('@hapi/boom');
const errorCatcher = require('async-error-catcher').default;

exports.isCommentAuthor = errorCatcher(async (req, res, next) => {
  const {user} = req;
  const {locals: {comment} = {}} = res;

  if (comment.get('author') !== user.id) {
    throw Boom.forbidden();
  }

  next();
});
