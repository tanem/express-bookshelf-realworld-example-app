'use strict';

const {knex} = require('../../db/connection');

module.exports = (app) => {
  app.locals.knex = knex;
};
