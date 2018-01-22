'use strict';

const {knex} = require('../db/connection');

module.exports = async () => {
  await knex.migrate.rollback();
  await knex.destroy();
};
