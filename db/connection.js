'use strict';

const knex = require('knex');
const config = require('../config');

// `global.__KNEX_TEST__` is the test specific knex instance created within the
// test support code. We want to use that if it's available, otherwise create a
// new knex instance.
exports.knex = global.__KNEX_TEST__ || knex(config.get('db'));
