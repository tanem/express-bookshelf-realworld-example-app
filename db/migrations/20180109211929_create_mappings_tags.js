'use strict';

exports.up = (knex) =>
  knex.schema.createTable('mappings_tags', (table) => {
    table.increments();
    table.timestamps();
    table
      .integer('mapping')
      .notNullable()
      .references('mappings.id')
      .onDelete('CASCADE');
    table
      .integer('tag')
      .notNullable()
      .references('tags.id')
      .onDelete('CASCADE');
    table.unique(['mapping', 'tag']);
  });

exports.down = (knex) => knex.schema.dropTableIfExists('mappings_tags');
