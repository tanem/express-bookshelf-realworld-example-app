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

  describe('POST /api/profiles/:username/follow', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .post(`/api/profiles/${follower.get('username')}/follow`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and the user to follow is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .post(`/api/profiles/invalid/follow`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(user)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the user to follow is found', () => {
        test('should follow the user to follow', async () => {
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
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .delete(`/api/profiles/${follower.get('username')}/follow`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and the user to unfollow is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .delete(`/api/profiles/invalid/follow`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(user)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the user to unfollow is found', () => {
        test('should unfollow the user to unfollow', async () => {
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
