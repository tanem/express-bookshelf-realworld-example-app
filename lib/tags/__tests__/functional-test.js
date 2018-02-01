'use strict';

const chance = require('chance').Chance('tag');
const request = require('supertest');
const app = require('../../app');

const {tags} = app.locals.services;

describe('tags', () => {
  let tagOne;
  let tagTwo;

  beforeEach(async () => {
    tagOne = await tags.create({name: chance.word()});
    tagTwo = await tags.create({name: chance.word()});
  });

  afterEach(async () => {
    await tags.del(tagOne);
    await tags.del(tagTwo);
  });

  describe('GET /api/tags', () => {
    test('should return a 200', async () => {
      const {body, status} = await request(app)
        .get('/api/tags')
        .set('Accept', 'application/json')
        .send();

      expect({body, status}).toMatchSnapshot();
    });
  });
});
