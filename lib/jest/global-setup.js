'use strict';

const knex = require('../knex');
const config = require('../config');

module.exports = async () => {
  if (!knex.client.pool) {
    knex.client.initializePool(config.get('db'));
  }
  await knex.migrate.latest();
};
