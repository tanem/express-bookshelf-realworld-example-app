'use strict';

const chance = require('chance').Chance('profile');
const request = require('supertest');
const app = require('../../app');

const {users} = app.locals.services;

describe('profiles', () => {
  let userOne;
  let userTwo;

  beforeEach(async () => {
    userOne = await users.create({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    });
    userTwo = await users.create({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    });
  });

  describe('GET /api/profiles/:username', () => {
    describe('when the username is not found', () => {
      test('should return a not found error', async () => {
        const {body, status} = await request(app)
          .get('/api/profiles/invalid')
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is not authenticated', () => {
      test('should return a user profile', async () => {
        const {body, status} = await request(app)
          .get(`/api/profiles/${userOne.get('username')}`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      test('should return a user profile', async () => {
        const {body, status} = await request(app)
          .get(`/api/profiles/${userTwo.get('username')}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${users.generateJWT(userOne)}`)
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });
  });
});
