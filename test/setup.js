// @flow

import {knex} from '../src/data/db';

beforeAll(async () => {
  // $FlowFixMe
  await knex.migrate.latest();
});

afterAll(async () => {
  // $FlowFixMe
  await knex.migrate.rollback();
  await knex.destroy();
});
