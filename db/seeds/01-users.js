'use strict';

const bcrypt = require('bcrypt');
const chance = require('chance').Chance('users-seed');

const getUsers = () =>
  ['user-one', 'user-two'].map((username) => ({
    bio: chance.profession(),
    created_at: new Date().toISOString(),
    email: chance.email(),
    hashed_password: bcrypt.hashSync('password', 12),
    image: chance.avatar(),
    updated_at: new Date().toISOString(),
    username,
  }));

exports.seed = async (knex) => {
  await knex('users').del();
  await knex('users').insert(getUsers());
};
