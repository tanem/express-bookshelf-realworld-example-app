'use strict';

const chance = require('chance').Chance('tags-seed');
const moment = require('moment');

const getTags = async (knex) => {
  const possibleTags = Array.from({length: 10}, () => {
    return chance.word();
  });
  const articleIds = await knex('articles').pluck('id');
  const articleTags = articleIds.map((id) => {
    return {
      article: id,
      tags: chance.pickset(possibleTags, chance.integer({min: 0, max: 3})),
    };
  });
  const allTags = articleTags
    .map(({tags}) => tags)
    .reduce((memo, arr) => memo.concat(arr), [])
    .filter((e, i, a) => a.indexOf(e) === i)
    .map((tag) => {
      const date = moment()
        .subtract(chance.integer({min: 0, max: 18}), 'months')
        .toISOString();
      return {
        name: tag,
        created_at: date,
        updated_at: date,
      };
    });
  return {
    taggedArticles: articleTags,
    tags: allTags,
  };
};

const getArticleTags = (taggedArticles) => async (knex) => {
  const allTags = await knex('tags');
  return taggedArticles
    .map(({article, tags}) => {
      return tags.map((tag) => [
        article,
        allTags.find(({name}) => name === tag).id,
      ]);
    })
    .reduce((memo, arr) => memo.concat(arr), [])
    .map(([article, tag]) => {
      const date = moment()
        .subtract(chance.integer({min: 0, max: 18}), 'months')
        .toISOString();
      return {
        article,
        tag,
        created_at: date,
        updated_at: date,
      };
    });
};

exports.seed = async (knex) => {
  const {tags, taggedArticles} = await getTags(knex);
  await knex('tags').del();
  await knex('tags').insert(tags);
  const articleTags = await getArticleTags(taggedArticles)(knex);
  await knex('articles_tags').del();
  await knex('articles_tags').insert(articleTags);
};
