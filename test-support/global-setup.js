'use strict';

const {knex} = require('../db/connection');

// This will also be set in the custom test environment to ensure we only use
// one knex instance between test setup code and the app under test.
global.__KNEX_TEST__ = knex;

module.exports = async () => {
  await global.__KNEX_TEST__.migrate.rollback();
  await global.__KNEX_TEST__.migrate.latest();
};
