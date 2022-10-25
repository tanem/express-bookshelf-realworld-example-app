'use strict';

exports.up = (knex) =>
  knex.schema.createTable('mappings', (table) => {
    table.increments();
    table.timestamps();
    table.string('slug').notNullable().unique();
    table.string('version');
    table.string('keyword');
    table.string('child_of');
    table.string('parent_of');
    table.string('mapper_code');
    table
      .integer('author')
      .notNullable()
      .references('users.id')
      .onDelete('CASCADE');
  });

exports.down = (knex) => knex.schema.dropTableIfExists('mappings');
