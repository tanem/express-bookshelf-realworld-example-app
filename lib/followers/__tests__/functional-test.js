'use strict';

const chance = require('chance').Chance('follow');
const request = require('supertest');
const app = require('../../app');

const {followers, users} = app.locals.services;

describe('followers', () => {
  let user;
  let follower;

  beforeEach(async () => {
    user = await users.create({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    });
    follower = await users.create({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    });
    await followers.create({
      user: user.id,
      follower: follower.id,
    });
  });

  afterEach(async () => {
    await user.destroy();
    await follower.destroy();
  });

  describe('POST /api/profiles/:username/follow', () => {
    describe('without a logged in user', () => {
      test('should return a 401', async () => {
        const {body, status} = await request(app)
          .post(`/api/profiles/${follower.get('username')}/follow`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('with a logged in user', () => {
      describe('and an invalid username', () => {
        test('should return a 404', async () => {
          const {body, status} = await request(app)
            .post(`/api/profiles/invalid/follow`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(user)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and a valid username', () => {
        test('should return a 200', async () => {
          const {body, status} = await request(app)
            .post(`/api/profiles/${follower.get('username')}/follow`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(user)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });
    });
  });

  describe('DELETE /api/profiles/:username/follow', () => {
    describe('without a logged in user', () => {
      test('should return a 401', async () => {
        const {body, status} = await request(app)
          .delete(`/api/profiles/${follower.get('username')}/follow`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('with a logged in user', () => {
      describe('and an invalid username', () => {
        test('should return a 404', async () => {
          const {body, status} = await request(app)
            .delete(`/api/profiles/invalid/follow`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(user)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and a valid username', () => {
        test('should return a 200', async () => {
          const {body, status} = await request(app)
            .delete(`/api/profiles/${user.get('username')}/follow`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(follower)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });
    });
  });
});
