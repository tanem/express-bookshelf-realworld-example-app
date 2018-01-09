'use strict';

const chance = require('chance').Chance('tag');
const request = require('supertest');
const Tag = require('../model');
const app = require('../../app');

describe('tag', () => {
  let tagOne;
  let tagTwo;

  beforeEach(async () => {
    tagOne = await new Tag({name: chance.word()}).save();
    tagTwo = await new Tag({name: chance.word()}).save();
  });

  afterEach(async () => {
    await tagOne.destroy();
    await tagTwo.destroy();
  });

  describe('GET /api/tags', () => {
    test('should return a 200', async () => {
      const response = await request(app)
        .get('/api/tags')
        .set('Accept', 'application/json')
        .send();

      expect(response.statusCode).toBe(200);
      expect(response.body).toMatchSnapshot();
    });
  });
});
