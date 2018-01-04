'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;
const Comment = require('./model');

exports.handleCommentId = errorCatcher(async (req, res, next) => {
  const {params: {commentId} = {}} = req;
  if (!commentId) {
    return next();
  }
  const comment = await new Comment({id: commentId}).fetch({
    withRelated: ['article', 'author'],
  });
  if (!comment) {
    // TODO: Add a descriptive error message?
    throw Boom.notFound();
  }
  res.locals.comment = comment;
  next();
});
