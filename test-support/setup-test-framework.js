'use strict';

const config = require('../config');
const {knex} = require('../db/connection');

require('./custom-matchers');

// Ensure CI test runs don't time out prematurely.
// See: https://facebook.github.io/jest/docs/en/troubleshooting.html#unresolved-promises
if (config.get('ci')) {
  jest.setTimeout(10000);
}

beforeAll(async () => {
  await knex.migrate.rollback();
  await knex.migrate.latest();
});

afterAll(async () => {
  await knex.migrate.rollback();
  await knex.destroy();
});
