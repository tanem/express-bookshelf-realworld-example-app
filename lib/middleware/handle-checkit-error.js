'use strict';

const Boom = require('@hapi/boom');
const Checkit = require('checkit');

module.exports = (err, req, res, next) => {
  if (isCheckitError(err)) {
    return next(
      Boom.boomify(err, {
        data: Object.keys(err.errors).reduce((errors, key) => {
          errors[key] = [err.errors[key].message];
          return errors;
        }, {}),
        statusCode: 422,
      }),
    );
  }

  next(err);
};

/*
Error {
  message: '1 invalid values',
  errors: {
    email: Error {
      message: 'select * from "usersZZZ" where "email" = $1 - relation "usersZZZ" does not exist',
      errors: [Array],
      key: 'email'
    }
  }
}
*/
function isCheckitError(error) {
  if (!error.errors) {
    return false;
  }

  let isCheckitError = true;

  Object.keys(error.errors).forEach((key) => {
    error.errors[key].errors.forEach((error) => {
      if (!(error instanceof Checkit.ValidationError)) {
        isCheckitError = false;
      }
    });
  });

  return isCheckitError;
}
