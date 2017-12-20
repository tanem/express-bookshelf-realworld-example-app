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
  });
});
