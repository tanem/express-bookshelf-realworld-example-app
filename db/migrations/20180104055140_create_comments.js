'use strict';

exports.up = (knex) =>
  knex.schema.createTable('comments', (table) => {
    table.increments();
    table.timestamps();
    table.text('body').notNullable();
    table
      .integer('author')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE');
    table
      .integer('mapping')
      .notNullable()
      .references('mappings.id')
      .onDelete('CASCADE');
  });

exports.down = (knex) => knex.schema.dropTableIfExists('comments');
