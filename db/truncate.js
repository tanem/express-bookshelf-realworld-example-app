'use strict';

let cachedTableNames;

const truncate = async (knex) => {
  if (!cachedTableNames) {
    const tables = await knex('pg_tables')
      .select('tablename')
      .where('schemaname', 'public');

    cachedTableNames = tables
      .map((t) => t.tablename)
      .filter((t) => !['knex_migrations', 'knex_migrations_lock'].includes(t))
      .join(',');
  }

  await knex.raw(`truncate table ${cachedTableNames} restart identity`);
};

module.exports = truncate;
