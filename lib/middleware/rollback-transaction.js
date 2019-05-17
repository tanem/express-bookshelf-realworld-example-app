'use strict';

const errorCatcher = require('async-error-catcher').default;

const rollbackTransaction = errorCatcher(async (err, req, res, next) => {
  const {
    locals: {trx},
  } = res;

  // `rollback` requires an error to reject the promise with.
  if (trx) {
    await trx.rollback(err);
  } else {
    next(err);
  }
});

module.exports = rollbackTransaction;
