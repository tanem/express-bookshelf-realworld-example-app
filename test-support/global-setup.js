'use strict';

const config = require('../config');
const {knex} = require('../db/connection');

module.exports = async () => {
  if (!knex.client.pool) {
    knex.client.initializePool(config.get('db'));
  }
  await knex.migrate.rollback();
  await knex.migrate.latest();
};
