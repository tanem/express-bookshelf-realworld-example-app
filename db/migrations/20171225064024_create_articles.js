'use strict';

exports.up = (knex) =>
  knex.schema.createTable('articles', (table) => {
    table.increments();
    table.timestamps();
    table.string('slug').notNullable().unique();
    table.string('title');
    table.string('description');
    table.text('body');
    table
      .integer('author')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE');
  });

exports.down = (knex) => knex.schema.dropTableIfExists('articles');
