'use strict';

const chance = require('chance').Chance('profile');
const request = require('supertest');
const app = require('../../app');

const {followers, users} = app.locals.services;

describe('profiles', () => {
  let userOne;
  let userTwo;
  let userWithoutImage;

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
    userWithoutImage = await users.create({
      bio: chance.profession(),
      email: chance.email(),
      image: '',
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

      describe('and the authenticated user follows the profile', () => {
        test('should return following as true', async () => {
          await followers.create({
            user: userTwo.id,
            follower: userOne.id,
          });

          const {body, status} = await request(app)
            .get(`/api/profiles/${userTwo.get('username')}`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(userOne)}`)
            .send();

          expect(status).toBe(200);
          expect(body).toEqual({
            profile: {
              bio: userTwo.get('bio'),
              following: true,
              image: userTwo.get('image'),
              username: userTwo.get('username'),
            },
          });
        });
      });
    });

    describe('when the user has no image', () => {
      test('should return the default image', async () => {
        const {body, status} = await request(app)
          .get(`/api/profiles/${userWithoutImage.get('username')}`)
          .set('Accept', 'application/json')
          .send();

        expect(status).toBe(200);
        expect(body).toEqual({
          profile: {
            bio: userWithoutImage.get('bio'),
            following: false,
            image: 'https://static.productionready.io/images/smiley-cyrus.jpg',
            username: userWithoutImage.get('username'),
          },
        });
      });
    });
  });
});
