'use strict';

const chance = require('chance').Chance('profile');
const request = require('supertest');
const app = require('../../app');

describe('profile integration', () => {
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
        // Register the user to retrieve profile JSON for.
        const username = chance.word();
        await request(app)
          .post('/api/users')
          .set('Accept', 'application/json')
          .send({
            user: {
              email: chance.email(),
              password: chance.string({length: 8}),
              username,
            },
          });

        const response = await request(app)
          .get(`/api/profiles/${username}`)
          .set('Accept', 'application/json')
          .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('with logged in user', () => {
      it('should return a 200', async () => {
        // Register the "logged in" user.
        const {body: {user: {token}}} = await request(app)
          .post('/api/users')
          .set('Accept', 'application/json')
          .send({
            user: {
              email: chance.email(),
              password: chance.string({length: 8}),
              username: chance.word(),
            },
          });

        // Register the user to retrieve profile JSON for.
        const username = chance.word();
        await request(app)
          .post('/api/users')
          .set('Accept', 'application/json')
          .send({
            user: {
              email: chance.email(),
              password: chance.string({length: 8}),
              username,
            },
          });

        const response = await request(app)
          .get(`/api/profiles/${username}`)
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${token}`)
          .send();

        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchSnapshot();
      });
    });
  });
});
