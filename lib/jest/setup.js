'use strict';

const config = require('../config');
const knex = require('../knex');

require('./custom-matchers');

jest.setTimeout(10000);

beforeAll(async () => {
  if (!knex.client.pool) {
    knex.client.initializePool(config.get('db'));
  }
});

afterAll(async () => {
  await knex.destroy();
});
