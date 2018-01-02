'use strict';

const config = require('../../config');

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  const status = err.status || 500;

  if (config.get('env') === 'production') {
    return res.status(status).json({
      errors: {
        message: err.message,
        error: {},
      },
    });
  }

  req.log.error(err.stack);

  res.status(status).json({
    errors: {
      message: err.message,
      error: err,
    },
  });
};
