'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;

module.exports = errorCatcher(async (req, res, next) => {
  const {app: {locals: {bookshelf} = {}} = {}, params: {username} = {}} = req;

  if (!username) {
    return next();
  }

  const user = await bookshelf
    .model('User')
    .forge({username})
    .fetch();

  // TODO: Add descriptive error message.
  if (!user) {
    throw Boom.notFound();
  }

  res.locals.user = user;

  next();
});
