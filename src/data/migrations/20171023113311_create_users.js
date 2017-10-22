// @flow

export const up = (knex: $FlowFixMe) =>
  knex.schema.createTable('users', table => {
    table.increments();
    table.string('username').notNullable();
    table.string('email').notNullable();
    table.string('bio');
    table.string('image');
    table.string('hash');
    table.string('salt');
    table.timestamps();
    table.unique('username');
    table.unique('email');
  });

export const down = (knex: $FlowFixMe) => knex.schema.dropTable('users');
