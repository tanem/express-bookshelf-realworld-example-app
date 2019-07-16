'use strict';

const Boom = require('@hapi/boom');

// See `unsafeValidateUnique` base model function comment for an explanation re
// why this middleware exists.
module.exports = (err, req, res, next) => {
  if (isPostgresUniqueError(err)) {
    return next(
      Boom.badData('', {
        [extractKey(err)]: ['has already been taken'],
      }),
    );
  }

  next(err);
};

function isPostgresUniqueError(err) {
  return err.code === '23505';
}

function extractKey(err) {
  const [, key] = err.detail.match(/\(([a-z, ]+)\)/);
  return key;
}
