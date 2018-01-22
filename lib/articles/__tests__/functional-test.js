'use strict';

const chance = require('chance').Chance('article');
const moment = require('moment');
const request = require('supertest');
const app = require('../../app');

const {articleTag, articles, tags, users} = app.locals.services;

describe('article', () => {
  let author;
  let nonAuthor;
  let article;
  let tagOne;
  let tagTwo;

  beforeEach(async () => {
    author = await users.create({
      bio: chance.profession(),
      email: chance.email(),
      image: chance.avatar(),
      password: chance.word({length: 8}),
      username: chance.word(),
    });
    nonAuthor = await users.create({
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
    tagOne = await tags.create({name: chance.word()});
    tagTwo = await tags.create({name: chance.word()});
    await articleTag.create({article: article.id, tag: tagOne.id});
    await articleTag.create({article: article.id, tag: tagTwo.id});
  });

  afterEach(async () => {
    await author.destroy();
    await nonAuthor.destroy();
  });

  describe('POST /api/articles', () => {
    describe('without a logged in user', () => {
      test('should return a 401', async () => {
        const response = await request(app)
          .post('/api/articles')
          .set('Accept', 'application/json')
          .send({
            article: {
              title: chance.word(),
            },
          });

        expect(response).toMatchObject({
          status: 401,
          body: {errors: {message: 'Unauthorized'}},
        });
      });
    });

    describe('with a logged in user', () => {
      test('should return a 201', async () => {
        const title = chance.word();
        const response = await request(app)
          .post('/api/articles')
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${author.generateJWT()}`)
          .send({
            article: {
              title,
            },
          });

        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual({
          article: {
            author: {
              bio: author.get('bio'),
              following: false,
              image: author.get('image'),
              username: author.get('username'),
            },
            createdAt: expect.any(String),
            favorited: false,
            favoritesCount: 0,
            slug: expect.stringMatching(new RegExp(`^${title}-[a-z0-9]{6}$`)),
            tagList: [],
            title,
            updatedAt: expect.any(String),
          },
        });
        expect(response.body.article.createdAt).toBeISO8601();
        expect(response.body.article.updatedAt).toBeISO8601();
        expect(response.body.article.createdAt).toBeBefore(moment());
        expect(response.body.article.updatedAt).toBeBefore(moment());
      });
    });
  });

  describe('GET /api/articles/:slug', () => {
    describe('with a logged in user', () => {
      describe('and an invalid slug', () => {
        test('should return a 404', async () => {
          const response = await request(app)
            .get('/api/articles/invalid')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${author.generateJWT()}`)
            .send();

          expect(response).toMatchObject({
            status: 404,
            body: {errors: {message: 'Not Found'}},
          });
        });
      });

      describe('and a valid slug', () => {
        test('should return a 200', async () => {
          const response = await request(app)
            .get(`/api/articles/${article.get('slug')}`)
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
              tagList: [tagOne.get('name'), tagTwo.get('name')],
              title: article.get('title'),
              updatedAt: moment(article.get('updated_at')).toISOString(),
            },
          });
        });
      });
    });

    describe('without a logged in user', () => {
      describe('and an invalid slug', () => {
        test('should return a 404', async () => {
          const response = await request(app)
            .get('/api/articles/invalid')
            .set('Accept', 'application/json')
            .send();

          expect(response).toMatchObject({
            status: 404,
            body: {errors: {message: 'Not Found'}},
          });
        });
      });

      describe('and a valid slug', () => {
        test('should return a 200', async () => {
          const response = await request(app)
            .get(`/api/articles/${article.get('slug')}`)
            .set('Accept', 'application/json')
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
              slug: article.get('slug'),
              tagList: [tagOne.get('name'), tagTwo.get('name')],
              title: article.get('title'),
              updatedAt: moment(article.get('updated_at')).toISOString(),
              favoritesCount: 0,
              favorited: false,
            },
          });
        });
      });
    });
  });

  describe('PUT /api/articles/:slug', () => {
    describe('without a logged in user', () => {
      test('should return a 401', async () => {
        const response = await request(app)
          .put('/api/articles/slug')
          .set('Accept', 'application/json')
          .send();

        expect(response).toMatchObject({
          status: 401,
          body: {errors: {message: 'Unauthorized'}},
        });
      });
    });

    describe('with a logged in user', () => {
      describe('and an invalid slug', () => {
        test('should return a 404', async () => {
          const response = await request(app)
            .put('/api/articles/invalid-slug')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${author.generateJWT()}`)
            .send();

          expect(response).toMatchObject({
            status: 404,
            body: {errors: {message: 'Not Found'}},
          });
        });
      });

      describe('and a valid slug', () => {
        describe('and the user is the author', () => {
          test('should return a 200', async () => {
            const body = chance.sentence();
            const description = chance.sentence();
            const title = chance.word();
            const response = await request(app)
              .put(`/api/articles/${article.get('slug')}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${author.generateJWT()}`)
              .send({
                article: {
                  body,
                  description,
                  title,
                },
              });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
              article: {
                author: {
                  bio: author.get('bio'),
                  following: false,
                  image: author.get('image'),
                  username: author.get('username'),
                },
                body,
                createdAt: moment(article.get('created_at')).toISOString(),
                description,
                slug: article.get('slug'),
                tagList: [tagOne.get('name'), tagTwo.get('name')],
                title,
                updatedAt: expect.any(String),
                favoritesCount: 0,
                favorited: false,
              },
            });
            expect(response.body.article.updatedAt).toBeISO8601();
            expect(response.body.article.updatedAt).toBeBetween({
              a: response.body.article.createdAt,
              b: moment(),
            });
          });
        });

        describe('and the user is not the author', () => {
          test('should return a 403', async () => {
            const response = await request(app)
              .put(`/api/articles/${article.get('slug')}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${nonAuthor.generateJWT()}`)
              .send({
                article: {
                  body: chance.sentence(),
                },
              });

            expect(response).toMatchObject({
              status: 403,
              body: {errors: {message: 'Forbidden'}},
            });
          });
        });
      });
    });
  });

  describe('DELETE /api/articles/:slug', () => {
    describe('without a logged in user', () => {
      test('should return a 401', async () => {
        const response = await request(app)
          .delete('/api/articles/slug')
          .set('Accept', 'application/json')
          .send();

        expect(response).toMatchObject({
          status: 401,
          body: {errors: {message: 'Unauthorized'}},
        });
      });
    });

    describe('with a logged in user', () => {
      describe('and an invalid slug', () => {
        test('should return a 404', async () => {
          const response = await request(app)
            .delete('/api/articles/invalid-slug')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${author.generateJWT()}`)
            .send();

          expect(response).toMatchObject({
            status: 404,
            body: {errors: {message: 'Not Found'}},
          });
        });
      });

      describe('and a valid slug', () => {
        describe('and the user is the author', () => {
          test('should return a 200', async () => {
            const response = await request(app)
              .delete(`/api/articles/${article.get('slug')}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${author.generateJWT()}`)
              .send();

            expect(response).toMatchObject({status: 200});
          });
        });

        describe('and the user is not the author', () => {
          test('should return a 403', async () => {
            const response = await request(app)
              .delete(`/api/articles/${article.get('slug')}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${nonAuthor.generateJWT()}`)
              .send();

            expect(response).toMatchObject({
              status: 403,
              body: {errors: {message: 'Forbidden'}},
            });
          });
        });
      });
    });
  });
});
