const chance = require('chance').Chance('user');
const jwt = require('jsonwebtoken');
const request = require('supertest');
const app = require('../../app');
const config = require('../../config');

describe('user integration', () => {
  describe('POST /api/users', () => {
    describe('with invalid parameters', () => {
      it('should return a 422', async () => {
        const response = await request(app)
          .post('/api/users')
          .set('Accept', 'application/json')
          .send({user: {}});

        expect(response.statusCode).toBe(422);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('with valid parameters', () => {
      it('should return a 201', async () => {
        const email = chance.email();
        const password = chance.string({length: 8});
        const username = chance.word();

        const response = await request(app)
          .post('/api/users')
          .set('Accept', 'application/json')
          .send({
            user: {
              email,
              password,
              username,
            },
          });

        expect(response.statusCode).toBe(201);

        // It's possible to verify the response via a snapshot here, but it
        // would mean ensuring the same token is generated each time. That would
        // likely involve mocking in order to generate consistent payload data
        // (specifically user id and issued at time), which is something we're
        // deliberately trying to avoid.
        expect(response.body).toEqual({
          user: {
            bio: null,
            email,
            image: null,
            token: expect.any(String),
            username,
          },
        });

        const decoded = jwt.verify(
          response.body.user.token,
          config.get('secret'),
        );
        expect(decoded.id).toEqual(expect.any(Number));
        expect(decoded.username).toBe(username);
        expect((decoded.exp - decoded.iat) / 60 / 60 / 24).toBe(60);
      });
    });
  });

  describe('POST /api/users/login', () => {
    describe('with invalid parameters', () => {
      it('should return a 422', async () => {
        const response = await request(app)
          .post('/api/users/login')
          .set('Accept', 'application/json')
          .send({user: {}});

        expect(response.statusCode).toBe(422);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('with valid parameters', () => {
      it('should return a 200', async () => {
        const email = chance.email();
        const password = chance.string({length: 8});
        const username = chance.word();

        // Register a user first.
        await request(app)
          .post('/api/users')
          .set('Accept', 'application/json')
          .send({
            user: {
              email,
              password,
              username,
            },
          });

        const response = await request(app)
          .post('/api/users/login')
          .set('Accept', 'application/json')
          .send({
            user: {
              email,
              password,
            },
          });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          user: {
            bio: null,
            email,
            image: null,
            token: expect.any(String),
            username,
          },
        });

        const decoded = jwt.verify(
          response.body.user.token,
          config.get('secret'),
        );
        expect(decoded.id).toEqual(expect.any(Number));
        expect(decoded.username).toBe(username);
        expect((decoded.exp - decoded.iat) / 60 / 60 / 24).toBe(60);
      });
    });
  });

  describe('GET /api/user', () => {
    describe('with invalid token', () => {
      it('should return a 401', async () => {
        const response = await request(app)
          .get('/api/user')
          .set('Accept', 'application/json')
          .set('Authorization', 'Token 123')
          .send();

        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('with valid token', () => {
      it('should return a 200', async () => {
        const email = chance.email();
        const password = chance.string({length: 8});
        const username = chance.word();

        // Register a user first.
        const {body: {user: {token}}} = await request(app)
          .post('/api/users')
          .set('Accept', 'application/json')
          .send({
            user: {
              email,
              password,
              username,
            },
          });

        const response = await request(app)
          .get('/api/user')
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${token}`)
          .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          user: {
            bio: null,
            email,
            image: null,
            token: expect.any(String),
            username,
          },
        });

        const decoded = jwt.verify(
          response.body.user.token,
          config.get('secret'),
        );
        expect(decoded.id).toEqual(expect.any(Number));
        expect(decoded.username).toBe(username);
        expect((decoded.exp - decoded.iat) / 60 / 60 / 24).toBe(60);
      });
    });
  });

  describe('PUT /api/user', () => {
    describe('with invalid token', () => {
      it('should return a 401', async () => {
        const response = await request(app)
          .put('/api/user')
          .set('Accept', 'application/json')
          .set('Authorization', 'Token 123')
          .send();

        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('with valid parameters', () => {
      it('should return a 200', async () => {
        const email = chance.email();
        const password = chance.string({length: 8});
        const username = chance.word();

        const {body: {user: {token}}} = await request(app)
          .post('/api/users')
          .set('Accept', 'application/json')
          .send({
            user: {
              email,
              password,
              username,
            },
          });

        const response = await request(app)
          .put('/api/user')
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${token}`)
          .send({
            user: {
              bio: 'Bleep bloop',
              image: 'http://fillmurray.com/200/300',
            },
          });

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          user: {
            bio: 'Bleep bloop',
            email,
            image: 'http://fillmurray.com/200/300',
            token: expect.any(String),
            username,
          },
        });

        const decoded = jwt.verify(
          response.body.user.token,
          config.get('secret'),
        );
        expect(decoded.id).toEqual(expect.any(Number));
        expect(decoded.username).toBe(username);
        expect((decoded.exp - decoded.iat) / 60 / 60 / 24).toBe(60);
      });
    });
  });
});
