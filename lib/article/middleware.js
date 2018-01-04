'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;
const Article = require('./model');

exports.handleSlug = errorCatcher(async (req, res, next) => {
  const {params: {slug} = {}} = req;
  if (!slug) {
    return next();
  }
  const article = await new Article({slug}).fetch({
    withRelated: ['author', 'favoritedBy'],
  });
  if (!article) {
    // TODO: Add a descriptive error message?
    throw Boom.notFound();
  }
  res.locals.article = article;
  next();
});
