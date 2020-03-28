'use strict';

exports.up = (knex) =>
  knex.schema.createTable('tags', (table) => {
    table.increments();
    table.timestamps();
    table.string('name').notNullable().unique();
  });

exports.down = (knex) => knex.schema.dropTableIfExists('tags');
