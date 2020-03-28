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
      .integer('article')
      .notNullable()
      .references('articles.id')
      .onDelete('CASCADE');
    table.unique(['article', 'user']);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('favorites');
