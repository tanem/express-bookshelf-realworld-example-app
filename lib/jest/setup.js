'use strict';

const config = require('../config');
const knex = require('../knex');

beforeAll(async () => {
  if (!knex.client.pool) {
    knex.client.initializePool(config.get('db'));
  }
});

afterAll(async () => {
  await knex.destroy();
});
