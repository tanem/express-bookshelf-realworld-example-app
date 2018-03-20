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

  describe('POST /api/users/login', () => {
    describe('when the request body is invalid', () => {
      test('should return an unprocessable entity error', async () => {
        const {body, status} = await request(app)
          .post('/api/users/login')
          .set('Accept', 'application/json')
          .send({user: {}});

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the request body is valid', () => {
      test('should log the user in', async () => {
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

  describe('POST /api/users', () => {
    describe('when the request body is invalid', () => {
      test('should return an unprocessable entity error', async () => {
        const {body, status} = await request(app)
          .post('/api/users')
          .set('Accept', 'application/json')
          .send({user: {}});

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the request body is valid', () => {
      test('should register the user', async () => {
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
        expect(body).toEqual({
          user: {
            bio: '',
            email,
            image: '',
            token: any.isValidJWT({username}),
            username,
          },
        });
      });
    });
  });

  describe('GET /api/user', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .get('/api/user')
          .set('Accept', 'application/json')
          .set('Authorization', 'Token 123')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      test('should return the user', async () => {
        const token = users.generateJWT(user);
        const {body, status} = await request(app)
          .get('/api/user')
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${token}`)
          .send();

        expect(status).toBe(200);
        expect(body).toEqual({
          user: {
            bio: user.get('bio'),
            email: user.get('email'),
            image: user.get('image'),
            token,
            username: user.get('username'),
          },
        });
      });
    });
  });

  describe('PUT /api/user', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .put('/api/user')
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and the request body is valid', () => {
        test('should update the user', async () => {
          const token = users.generateJWT(user);
          const {body, status} = await request(app)
            .put('/api/user')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${token}`)
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
              token,
              username: user.get('username'),
            },
          });
        });
      });
    });
  });
});
