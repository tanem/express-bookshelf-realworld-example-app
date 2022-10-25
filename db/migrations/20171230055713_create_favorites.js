'use strict';

exports.up = (knex) =>
  knex.schema.createTable('favorites', (table) => {
    table.increments();
    table.timestamps();
    table
      .integer('user')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE');
    table
      .integer('mapping')
      .notNullable()
      .references('mappings.id')
      .onDelete('CASCADE');
    table.unique(['mapping', 'user']);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('favorites');
