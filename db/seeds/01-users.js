'use strict';

const bcrypt = require('bcrypt');
const chance = require('chance').Chance('users-seed');
const moment = require('moment');

const getUsers = () =>
  ['user-one', 'user-two'].map((username) => ({
    bio: chance.profession(),
    created_at: moment().toISOString(),
    email: chance.email(),
    hashed_password: bcrypt.hashSync('password', 12),
    image: chance.avatar(),
    updated_at: moment().toISOString(),
    username,
  }));

exports.seed = async (knex) => {
  await knex('users').del();
  await knex('users').insert(getUsers());
};
