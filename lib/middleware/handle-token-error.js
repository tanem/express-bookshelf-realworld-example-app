'use strict';

const Boom = require('boom');

module.exports = (err, req, res, next) => {
  if (isTokenError(err)) {
    return next(
      Boom.boomify(err, {
        data: {[err.name]: [err.message]},
        statusCode: err.status,
      }),
    );
  }

  next(err);
};

function isTokenError(err) {
  return err.name === 'UnauthorizedError';
}
