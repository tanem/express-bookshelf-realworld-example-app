'use strict';

const Boom = require('boom');

// TODO: Add docs around why this exists (wrt unsafeValidateUnique).
module.exports = (err, req, res, next) => {
  if (isPostgresUniqueError(err)) {
    return next(
      Boom.badData('', {[extractField(err)]: ['has already been taken']}),
    );
  }

  next(err);
};

function isPostgresUniqueError(error) {
  return error.code === '23505';
}

function extractField(error) {
  const [, field] = /\(([a-z]+)(?:, [a-z]+){0,1}\)/.exec(error.detail);
  return field;
}
