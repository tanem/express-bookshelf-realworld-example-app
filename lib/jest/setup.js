'use strict';

const config = require('../config');
const knex = require('../knex');

require('./custom-matchers');

// Ensure CI test runs don't time out prematurely.
// See: https://facebook.github.io/jest/docs/en/troubleshooting.html#unresolved-promises
if (config.get('ci')) {
  jest.setTimeout(10000);
}

beforeAll(async () => {
  if (!knex.client.pool) {
    knex.client.initializePool(config.get('db'));
  }
});

afterAll(async () => {
  await knex.destroy();
});
