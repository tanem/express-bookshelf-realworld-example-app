'use strict';

const chance = require('chance').Chance('favorite');
const moment = require('moment');
const request = require('supertest');
const app = require('../../app');

const {articles, favorites, users} = app.locals.services;

describe('favorites', () => {
  let user;
  let author;
  let article;

  beforeEach(async () => {
    user = await users.create({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    });
    author = await users.create({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    });
    article = await articles.create({
      author: author.id,
      body: chance.paragraph({sentences: 10}),
      description: chance.paragraph({sentences: 2}),
      title: chance.sentence({words: 3}),
    });
    await favorites.create({
      user: author.id,
      article: article.id,
    });
  });

  describe('POST /api/articles/:slug/favorite', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .post(`/api/articles/${article.get('slug')}/favorite`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and the article is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .post('/api/articles/invalid-slug/favorite')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(user)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the article is found', () => {
        test('should favorite the article', async () => {
          const {body, status} = await request(app)
            .post(`/api/articles/${article.get('slug')}/favorite`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(user)}`)
            .send();

          expect(status).toBe(200);
          expect(body).toEqual({
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
              tagList: [],
              title: article.get('title'),
              updatedAt: moment(article.get('updated_at')).toISOString(),
            },
          });
        });
      });
    });
  });

  describe('DELETE /api/articles/:slug/favorite', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .delete(`/api/articles/${article.get('slug')}/favorite`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and the article is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .delete('/api/articles/invalid-slug/favorite')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(author)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the article is found', () => {
        test('should unfavorite the article', async () => {
          const {body, status} = await request(app)
            .delete(`/api/articles/${article.get('slug')}/favorite`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(author)}`)
            .send();

          expect(status).toBe(200);
          expect(body).toEqual({
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
              tagList: [],
              title: article.get('title'),
              updatedAt: moment(article.get('updated_at')).toISOString(),
            },
          });
        });
      });
    });
  });
});
