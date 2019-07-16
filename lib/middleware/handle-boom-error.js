'use strict';

const Boom = require('@hapi/boom');
const config = require('../../config');

module.exports = (err, req, res, next) => {
  if (Boom.isBoom(err)) {
    if (err.output.statusCode === 422) {
      return res.status(err.output.statusCode).json({
        errors: err.data,
      });
    }

    if (config.get('env') === 'production') {
      return res.status(err.output.statusCode).json({
        errors: {
          message: err.message,
          error: {},
        },
      });
    }

    req.log.error(err.stack);

    return res.status(err.output.statusCode).json({
      errors: {
        message: err.message,
        error: err,
      },
    });
  }

  next(err);
};
