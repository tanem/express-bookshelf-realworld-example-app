'use strict';

const chance = require('chance').Chance('tag');
const request = require('supertest');
const app = require('../../app');

const {tags} = app.locals.services;

describe('tags', () => {
  beforeEach(async () => {
    await tags.create({name: chance.word()});
    await tags.create({name: chance.word()});
  });

  describe('GET /api/tags', () => {
    test('should return a list of all tags', async () => {
      const {body, status} = await request(app)
        .get('/api/tags')
        .set('Accept', 'application/json')
        .send();

      expect({body, status}).toMatchSnapshot();
    });
  });
});
