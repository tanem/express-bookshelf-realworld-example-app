'use strict';

exports.up = (knex) =>
  knex.schema.createTable('articles_tags', (table) => {
    table.increments();
    table.timestamps();
    table
      .integer('article')
      .notNullable()
      .references('articles.id')
      .onDelete('CASCADE');
    table
      .integer('tag')
      .notNullable()
      .references('tags.id')
      .onDelete('CASCADE');
    table.unique(['article', 'tag']);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('articles_tags');
