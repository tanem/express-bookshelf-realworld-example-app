'use strict';

const config = require('../config');
const {knex} = require('../db/connection');

// This will also be set in the custom test environment to ensure we only use
// one knex instance between test setup code and the app under test.
global.__KNEX_TEST__ = knex;

module.exports = async () => {
  // When running tests in `--watch` mode, the connection pool will be destroyed
  // in `global-teardown.js` between runs, so we need to make sure it's
  // recreated in those cases.
  if (!global.__KNEX_TEST__.client.pool) {
    global.__KNEX_TEST__.client.initializePool(config.get('db'));
  }
  await global.__KNEX_TEST__.migrate.rollback();
  await global.__KNEX_TEST__.migrate.latest();
};
