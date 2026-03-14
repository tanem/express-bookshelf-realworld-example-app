'use strict';

// Must have exactly 4 parameters so Express recognises it as error middleware.
module.exports = async (err, req, res, next) => {
  const {
    locals: {trx},
  } = res;

  // `rollback` requires an error to reject the promise with.
  if (trx) {
    try {
      await trx.rollback(err);
    } catch (_) {
      // Transaction may already be completed.
    }
  }

  next(err);
};
