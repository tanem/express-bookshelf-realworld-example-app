'use strict';

const chance = require('chance').Chance('articles-seed');
const moment = require('moment');
const slug = require('slug');
const {v4: uuidv4} = require('uuid');

const getArticles = async (knex) => {
  const userIds = await knex('users').pluck('id');
  return userIds
    .map((userId) =>
      Array.from({length: 100}, () => {
        const title = chance.sentence({words: 3});
        const date = moment()
          .subtract(chance.integer({min: 0, max: 18}), 'months')
          .toISOString();
        return {
          author: userId,
          body: chance.paragraph({sentences: 10}),
          created_at: date,
          description: chance.paragraph({sentences: 2}),
          slug: slug(`${title}-${uuidv4().substr(0, 6)}`, {
            lower: true,
          }),
          title,
          updated_at: date,
        };
      }),
    )
    .reduce((memo, arr) => memo.concat(arr), []);
};

exports.seed = async (knex) => {
  const articles = await getArticles(knex);
  await knex('articles').del();
  await knex('articles').insert(articles);
};
