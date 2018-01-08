'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;
const User = require('../user/model');

module.exports = errorCatcher(async (req, res, next) => {
  const {params: {username} = {}} = req;
  if (!username) return next();
  const user = await new User({username}).fetch();
  // TODO: Add descriptive error message.
  if (!user) throw Boom.notFound();
  res.locals.user = user;
  next();
});
