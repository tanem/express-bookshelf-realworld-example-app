'use strict';

const config = require('../config');
const knex = require('../knex');

require('./custom-matchers');

beforeAll(async () => {
  if (!knex.client.pool) {
    knex.client.initializePool(config.get('db'));
  }
});

afterAll(async () => {
  await knex.destroy();
});
