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

  afterEach(async () => {
    await userOne.destroy();
    await userTwo.destroy();
  });

  describe('GET /api/profiles/:username', () => {
    describe('with invalid username', () => {
      test('should return a 404', async () => {
        const {body, status} = await request(app)
          .get('/api/profiles/invalid')
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('without logged in user', () => {
      test('should return a 200', async () => {
        const {body, status} = await request(app)
          .get(`/api/profiles/${userOne.get('username')}`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('with logged in user', () => {
      test('should return a 200', async () => {
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
