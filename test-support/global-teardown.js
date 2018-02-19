'use strict';

module.exports = async () => {
  await global.__KNEX_TEST__.migrate.rollback();
  await global.__KNEX_TEST__.destroy();
};
