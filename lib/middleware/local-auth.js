'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;
const passport = require('passport');

module.exports = errorCatcher(async (req, res, next) => {
  const {body: {user: {email, password} = {}} = {}} = req;

  if (!email || !password) {
    throw Boom.badData('', {'email or password': ['is invalid']});
  }

  passport.authenticate('local', {session: false}, (error, user) => {
    if (error) throw error;
    req.user = user;
    next();
  })(req, res, next);
});
