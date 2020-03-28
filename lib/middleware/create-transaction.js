'use strict';

const interceptor = require('express-interceptor');

module.exports = (req, res, next) => {
  const {app: {locals: {knex} = {}} = {}} = req;

  // Transaction creation and committing before send are always coupled, so we
  // may as well do both here rather than always having to remember to apply the
  // two middleware functions to a route.
  knex.transaction((trx) => {
    res.locals.trx = trx;
    commitTransactionBeforeSend(res, res, next);
  });
};

// Commits a transaction just prior to sending the response, since if we got to
// that point all controller and related operations would have completed
// successfully.
//
// Note that transaction rollack is handled in the `rollback-transaction.js`
// middleware.
function commitTransactionBeforeSend(req, res, next) {
  interceptor((req, res) => ({
    isInterceptable: () => true,
    intercept: async (body, send) => {
      await res.locals.trx.commit();
      send(body);
    },
  }))(req, res, next);
}
