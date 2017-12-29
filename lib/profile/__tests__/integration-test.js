'use strict';

const chance = require('chance').Chance('profile');
const request = require('supertest');
const app = require('../../app');
const User = require('../../user/model');

describe('profile integration', () => {
  let userOne;
  let userTwo;

  beforeEach(async () => {
    userOne = await new User({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    }).save();
    userTwo = await new User({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    }).save();
  });

  afterEach(async () => {
    await userOne.destroy();
    await userTwo.destroy();
  });

  describe('GET /api/profiles/:username', () => {
    describe('with invalid username', () => {
      it('should return a 404', async () => {
        const response = await request(app)
          .get('/api/profiles/invalid')
          .set('Accept', 'application/json')
          .send();

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('without logged in user', () => {
      it('should return a 200', async () => {
        const response = await request(app)
          .get(`/api/profiles/${userOne.get('username')}`)
          .set('Accept', 'application/json')
          .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('with logged in user', () => {
      it('should return a 200', async () => {
        const response = await request(app)
          .get(`/api/profiles/${userTwo.get('username')}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${userOne.generateJWT()}`)
          .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
