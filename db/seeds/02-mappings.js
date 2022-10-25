'use strict';

const chance = require('chance').Chance('mappings-seed');
const moment = require('moment');
const slug = require('slug');
const {v4: uuidv4} = require('uuid');

const getMappings = async (knex) => {
  const userIds = await knex('users').pluck('id');
  return userIds
    .map((userId) =>
      Array.from({length: 100}, () => {
        const keyword = chance.sentence({words: 3});
        const date = moment()
          .subtract(chance.integer({min: 0, max: 18}), 'months')
          .toISOString();
        return {
          author: userId,
          mapper_code: chance.paragraph({sentences: 10}),
          keyword : chance.sentence({words: 3}),
          version : chance.sentence({words: 3}),
          child_of: chance.sentence({words: 3}),
          parent_of: chance.sentence({words: 3});
          created_at: date,
          slug: slug(`${keyword}-${uuidv4().substr(0, 6)}`, {
            lower: true,
          }),
          updated_at: date,
        };
      }),
    )
    .reduce((memo, arr) => memo.concat(arr), []);
};

exports.seed = async (knex) => {
  const mappings = await getMappings(knex);
  await knex('mappings').del();
  await knex('mappings').insert(mappings);
};
