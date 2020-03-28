'use strict';

const truncate = async (knex) => {
  const tables = await knex('pg_tables')
    .select('tablename')
    .where('schemaname', 'public');

  const tableNames = tables
    .map((t) => t.tablename)
    .filter((t) => !['knex_migrations', 'knex_migrations_lock'].includes(t))
    .join(',');

  await knex.raw(`truncate table ${tableNames} restart identity`);
};

module.exports = truncate;
