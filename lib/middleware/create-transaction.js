'use strict';

module.exports = (req, res, next) => {
  const {app: {locals: {knex} = {}} = {}} = req;

  // Transaction creation and committing before send are always coupled, so we
  // may as well do both here rather than always having to remember to apply the
  // two middleware functions to a route.
  knex
    .transaction((trx) => {
      res.locals.trx = trx;

      // Commits the transaction just prior to sending the response. Intercepts
      // res.end so the commit happens before any data reaches the client.
      // Transaction rollback is handled in rollback-transaction.js middleware.
      const origEnd = res.end;
      res.end = function (...args) {
        trx.commit().then(
          () => origEnd.apply(res, args),
          () => origEnd.apply(res, args),
        );
      };

      next();
    })
    .catch(() => {
      // Transaction was rolled back via rollback-transaction middleware.
      // Catching here prevents an unhandled promise rejection.
    });
};
