'use strict';

const config = require('../config');

require('./custom-matchers');

// Ensure CI test runs don't time out prematurely.
// See: https://facebook.github.io/jest/docs/en/troubleshooting.html#unresolved-promises
if (config.get('ci')) {
  jest.setTimeout(10000);
}

// Ensure the DB is clean prior to running a test. Note that test-specific data
// is set up within a test's `beforeEach`.
beforeEach(async () => {
  const tables = await global
    .__KNEX_TEST__('pg_tables')
    .select('tablename')
    .where('schemaname', 'public');

  const tableNames = tables
    .map(t => t.tablename)
    .filter(t => !['knex_migrations', 'knex_migrations_lock'].includes(t))
    .join(',');

  await global.__KNEX_TEST__.raw(
    `TRUNCATE TABLE ${tableNames} RESTART IDENTITY`,
  );
});
