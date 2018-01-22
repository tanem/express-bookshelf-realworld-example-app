'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;

module.exports = errorCatcher(async (req, res, next) => {
  const {app: {locals: {bookshelf} = {}} = {}, params: {commentId} = {}} = req;

  if (!commentId) {
    return next();
  }

  const comment = await bookshelf
    .model('Comment')
    .forge({id: commentId})
    .fetch({
      withRelated: ['article', 'author'],
    });

  if (!comment) {
    throw Boom.notFound('Comment Not Found');
  }

  res.locals.comment = comment;

  next();
});
