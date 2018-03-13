'use strict';

const config = require('../config');
const truncate = require('../db/truncate');

require('./custom-matchers');

// Ensure CI test runs don't time out prematurely.
// See: https://facebook.github.io/jest/docs/en/troubleshooting.html#unresolved-promises
if (config.get('ci')) {
  jest.setTimeout(10000);
}

// Ensure the DB is clean prior to running a test. Note that test-specific data
// is set up within a test's `beforeEach`.
beforeEach(async () => {
  await truncate(global.__KNEX_TEST__);
});
