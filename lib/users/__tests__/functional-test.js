'use strict';

const chance = require('chance').Chance('user');
const request = require('supertest');
const app = require('../../app');

const {users} = app.locals.services;

describe('users', () => {
  let user;

  beforeEach(async () => {
    user = await users.create({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: 'password',
      username: chance.word(),
    });
  });

  afterEach(async () => {
    await user.destroy();
  });

  describe('POST /api/users', () => {
    describe('with invalid parameters', () => {
      test('should return a 422', async () => {
        const {body, status} = await request(app)
          .post('/api/users')
          .set('Accept', 'application/json')
          .send({user: {}});

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('with valid parameters', () => {
      test('should return a 201', async () => {
        const email = chance.email();
        const password = chance.string({length: 8});
        const username = chance.word();

        const {body, status} = await request(app)
          .post('/api/users')
          .set('Accept', 'application/json')
          .send({
            user: {
              email,
              password,
              username,
            },
          });

        expect(status).toBe(201);

        // TODO: Move this comment into a README section explaining the testing
        // approach (snapshot -> manaul + asymmetric matchers).
        //
        // It's possible to verify the response via a snapshot here, but it
        // would mean ensuring the same token is generated each time. That would
        // likely involve mocking in order to generate consistent payload data
        // (specifically user id and issued at time), which is something we're
        // deliberately trying to avoid.
        expect(body).toEqual({
          user: {
            bio: null,
            email,
            image: null,
            token: any.isValidJWT({username}),
            username,
          },
        });
      });
    });
  });

  describe('POST /api/users/login', () => {
    describe('with invalid parameters', () => {
      test('should return a 422', async () => {
        const {body, status} = await request(app)
          .post('/api/users/login')
          .set('Accept', 'application/json')
          .send({user: {}});

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('with valid parameters', () => {
      test('should return a 200', async () => {
        const {body, status} = await request(app)
          .post('/api/users/login')
          .set('Accept', 'application/json')
          .send({
            user: {
              email: user.get('email'),
              password: 'password',
            },
          });

        expect(status).toBe(200);
        expect(body).toEqual({
          user: {
            bio: user.get('bio'),
            email: user.get('email'),
            image: user.get('image'),
            token: any.isValidJWT({username: user.get('username')}),
            username: user.get('username'),
          },
        });
      });
    });
  });

  describe('GET /api/user', () => {
    describe('with invalid token', () => {
      test('should return a 401', async () => {
        const {body, status} = await request(app)
          .get('/api/user')
          .set('Accept', 'application/json')
          .set('Authorization', 'Token 123')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('with valid token', () => {
      test('should return a 200', async () => {
        const {body, status} = await request(app)
          .get('/api/user')
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${users.generateJWT(user)}`)
          .send();

        expect(status).toBe(200);
        expect(body).toEqual({
          user: {
            bio: user.get('bio'),
            email: user.get('email'),
            image: user.get('image'),
            token: any.isValidJWT({username: user.get('username')}),
            username: user.get('username'),
          },
        });
      });
    });
  });

  describe('PUT /api/user', () => {
    describe('with invalid token', () => {
      test('should return a 401', async () => {
        const {body, status} = await request(app)
          .put('/api/user')
          .set('Accept', 'application/json')
          .set('Authorization', 'Token 123')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('with valid parameters', () => {
      test('should return a 200', async () => {
        const {body, status} = await request(app)
          .put('/api/user')
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${users.generateJWT(user)}`)
          .send({
            user: {
              bio: 'Bleep bloop',
              image: 'http://fillmurray.com/200/300',
            },
          });

        expect(status).toBe(200);
        expect(body).toEqual({
          user: {
            bio: 'Bleep bloop',
            email: user.get('email'),
            image: 'http://fillmurray.com/200/300',
            token: any.isValidJWT({username: user.get('username')}),
            username: user.get('username'),
          },
        });
      });
    });
  });
});
