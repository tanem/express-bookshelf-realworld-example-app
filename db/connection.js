'use strict';

const knex = require('knex');
const config = require('../config');

exports.knex = knex(config.get('db'));
