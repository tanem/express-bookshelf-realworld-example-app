'use strict';

const Boom = require('boom');

// TODO
// - Add docs around why this exists (wrt unsafeValidateUnique).
// - Explain "catch-all" error message, since this should be a rare occurrence,
//   with client validation catching most of it.
// - Explain assumptions around pg error format wrt regex etc.
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
