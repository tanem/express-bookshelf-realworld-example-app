'use strict';

exports.up = knex =>
  knex.schema.createTable('users', table => {
    table.increments();
    table.timestamps();
    table
      .string('username')
      .notNullable()
      .unique();
    table
      .string('email')
      .notNullable()
      .unique();
    table.string('hashed_password').notNullable();
    table.string('bio');
    table.string('image');
  });

exports.down = knex => knex.schema.dropTableIfExists('users');
