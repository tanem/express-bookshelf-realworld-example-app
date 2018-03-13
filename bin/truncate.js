#!/usr/bin/env node

/* eslint-disable no-console */

const truncate = require('../db/truncate');
const {knex} = require('../db/connection');

(async () => {
  try {
    await truncate(knex);
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
})();
