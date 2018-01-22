'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;
const passport = require('passport');

const callback = (req, res, next) => (error, user, info = {}) => {
  if (error) {
    throw error;
  }

  if (info.message === 'No auth token') {
    throw Boom.unauthorized();
  }

  if (user) {
    req.user = user;
  }

  next();
};

exports.required = errorCatcher(async (req, res, next) => {
  // prettier-ignore
  passport.authenticate(
    'jwt',
    {session: false},
    callback(req, res, next),
  )(req, res, next);
});

exports.optional = errorCatcher(async (req, res, next) => {
  passport.authenticate(
    ['jwt', 'anonymous'],
    {session: false},
    callback(req, res, next),
  )(req, res, next);
});
