'use strict';

const knex = require('../knex');

module.exports = async () => {
  await knex.migrate.rollback();
  await knex.destroy();
};
