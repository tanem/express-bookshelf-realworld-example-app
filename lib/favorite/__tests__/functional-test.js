'use strict';

const chance = require('chance').Chance('favorite');
const moment = require('moment');
const request = require('supertest');
const app = require('../../app');
const Article = require('../../article/model');
const Favorite = require('../model');
const User = require('../../user/model');

describe('favorite', () => {
  let user;
  let author;
  let article;

  beforeEach(async () => {
    user = await new User({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    }).save();
    author = await new User({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    }).save();
    article = await new Article({
      author: author.id,
      body: chance.paragraph({sentences: 10}),
      description: chance.paragraph({sentences: 2}),
      title: chance.sentence({words: 3}),
    }).save();
    await new Favorite({
      user: author.id,
      article: article.id,
    }).save();
  });

  afterEach(async () => {
    await author.destroy();
    await user.destroy();
  });

  describe('POST /api/articles/:slug/favorite', () => {
    describe('without a logged in user', () => {
      test('should return a 401', async () => {
        const {statusCode, body} = await request(app)
          .post(`/api/articles/${article.get('slug')}/favorite`)
          .set('Accept', 'application/json')
          .send();

        expect(statusCode).toBe(401);
        expect(body).toMatchSnapshot();
      });
    });

    describe('with a logged in user', () => {
      describe('and an invalid slug', () => {
        test('should return a 404', async () => {
          const response = await request(app)
            .post('/api/articles/invalid-slug/favorite')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${user.generateJWT()}`)
            .send();

          expect(response.statusCode).toBe(404);
          expect(response.body).toMatchSnapshot();
        });
      });

      describe('and a valid slug', () => {
        test('should return a 200', async () => {
          const response = await request(app)
            .post(`/api/articles/${article.get('slug')}/favorite`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${user.generateJWT()}`)
            .send();

          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({
            article: {
              author: {
                bio: author.get('bio'),
                following: false,
                image: author.get('image'),
                username: author.get('username'),
              },
              body: article.get('body'),
              createdAt: moment(article.get('created_at')).toISOString(),
              description: article.get('description'),
              favorited: true,
              favoritesCount: 2,
              slug: article.get('slug'),
              title: article.get('title'),
              updatedAt: moment(article.get('updated_at')).toISOString(),
            },
          });
        });
      });
    });
  });

  describe('DELETE /api/articles/:slug/favorite', () => {
    describe('without a logged in user', () => {
      test('should return a 401', async () => {
        const {statusCode, body} = await request(app)
          .delete(`/api/articles/${article.get('slug')}/favorite`)
          .set('Accept', 'application/json')
          .send();

        expect(statusCode).toBe(401);
        expect(body).toMatchSnapshot();
      });
    });

    describe('with a logged in user', () => {
      describe('and an invalid slug', () => {
        test('should return a 404', async () => {
          const response = await request(app)
            .delete('/api/articles/invalid-slug/favorite')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${author.generateJWT()}`)
            .send();

          expect(response.statusCode).toBe(404);
          expect(response.body).toMatchSnapshot();
        });
      });

      describe('and a valid slug', () => {
        test('should return a 200', async () => {
          const response = await request(app)
            .delete(`/api/articles/${article.get('slug')}/favorite`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${author.generateJWT()}`)
            .send();

          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({
            article: {
              author: {
                bio: author.get('bio'),
                following: false,
                image: author.get('image'),
                username: author.get('username'),
              },
              body: article.get('body'),
              createdAt: moment(article.get('created_at')).toISOString(),
              description: article.get('description'),
              favorited: false,
              favoritesCount: 0,
              slug: article.get('slug'),
              title: article.get('title'),
              updatedAt: moment(article.get('updated_at')).toISOString(),
            },
          });
        });
      });
    });
  });
});
