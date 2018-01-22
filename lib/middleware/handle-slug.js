'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;

module.exports = errorCatcher(async (req, res, next) => {
  const {app: {locals: {bookshelf} = {}} = {}, params: {slug} = {}} = req;

  // TODO: Is this needed? The route would not have matched?
  if (!slug) {
    return next();
  }

  const article = await bookshelf
    .model('Article')
    .forge({slug})
    .fetch({
      withRelated: ['author', 'favoritedBy', 'tags'],
    });

  if (!article) {
    throw Boom.notFound();
  }

  res.locals.article = article;

  next();
});
