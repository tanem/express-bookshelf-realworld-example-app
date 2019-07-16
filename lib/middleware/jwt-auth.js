'use strict';

const Boom = require('@hapi/boom');
const errorCatcher = require('async-error-catcher').default;
const passport = require('passport');

const callback = (req, res, next) => async (
  error,
  {userId} = {},
  info = {},
) => {
  const {
    app: {
      locals: {
        services: {users},
      },
    },
    locals: {trx},
  } = res;

  if (error) {
    return next(error);
  }

  if (info instanceof Error || info.name === 'JsonWebTokenError') {
    return next(Boom.unauthorized());
  }

  let user;
  try {
    user = await users.fetch({id: userId}, {transacting: trx});
  } catch (error) {
    return next(Boom.unauthorized());
  }

  req.user = user;

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
