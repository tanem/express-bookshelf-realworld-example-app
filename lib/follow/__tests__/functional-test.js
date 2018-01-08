'use strict';

const chance = require('chance').Chance('follow');
const request = require('supertest');
const Follow = require('../model');
const {Model: User} = require('../../user');
const app = require('../../app');

describe('follow', () => {
  let user;
  let follower;

  beforeEach(async () => {
    user = await new User({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    }).save();
    follower = await new User({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    }).save();
    await new Follow({
      user: user.id,
      follower: follower.id,
    }).save();
  });

  afterEach(async () => {
    await user.destroy();
    await follower.destroy();
  });

  describe('POST /api/profiles/:username/follow', () => {
    describe('without a logged in user', () => {
      test('should return a 401', async () => {
        const response = await request(app)
          .post(`/api/profiles/${follower.get('username')}/follow`)
          .set('Accept', 'application/json')
          .send();

        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('with a logged in user', () => {
      describe('and an invalid username', () => {
        test('should return a 404', async () => {
          const response = await request(app)
            .post(`/api/profiles/invalid/follow`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${user.generateJWT()}`)
            .send();

          expect(response.statusCode).toBe(404);
          expect(response.body).toMatchSnapshot();
        });
      });

      describe('and a valid username', () => {
        test('should return a 200', async () => {
          const response = await request(app)
            .post(`/api/profiles/${follower.get('username')}/follow`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${user.generateJWT()}`)
            .send();

          expect(response.statusCode).toBe(200);
          expect(response.body).toMatchSnapshot();
        });
      });
    });
  });

  describe('DELETE /api/profiles/:username/follow', () => {
    describe('without a logged in user', () => {
      test('should return a 401', async () => {
        const response = await request(app)
          .delete(`/api/profiles/${follower.get('username')}/follow`)
          .set('Accept', 'application/json')
          .send();

        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('with a logged in user', () => {
      describe('and an invalid username', () => {
        test('should return a 404', async () => {
          const response = await request(app)
            .delete(`/api/profiles/invalid/follow`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${user.generateJWT()}`)
            .send();

          expect(response.statusCode).toBe(404);
          expect(response.body).toMatchSnapshot();
        });
      });

      describe('and a valid username', () => {
        test('should return a 200', async () => {
          const response = await request(app)
            .delete(`/api/profiles/${user.get('username')}/follow`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${follower.generateJWT()}`)
            .send();

          expect(response.statusCode).toBe(200);
          expect(response.body).toMatchSnapshot();
        });
      });
    });
  });
});
