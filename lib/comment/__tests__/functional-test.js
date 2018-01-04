'use strict';

const chance = require('chance').Chance('comment');
const moment = require('moment');
const request = require('supertest');
const app = require('../../app');
const Article = require('../../article/model');
// const Favorite = require('../model');
const User = require('../../user/model');
const Comment = require('../model');

describe('comment', () => {
  let user;
  let author;
  let article;
  let comment;

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
    comment = await new Comment({
      article: article.id,
      author: author.id,
      body: chance.paragraph({sentences: 2}),
    }).save();
  });

  afterEach(async () => {
    await author.destroy();
    await user.destroy();
  });

  describe('GET /api/articles/:slug/comments', () => {
    describe('with an invalid slug', () => {
      test('should return a 404', async () => {
        const response = await request(app)
          .get('/api/articles/invalid-slug/comments')
          .set('Accept', 'application/json')
          .send();

        expect(response.statusCode).toBe(404);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('without a logged in user', () => {
      describe('and a valid article slug', () => {
        test(`should return the article's comments`, async () => {
          const response = await request(app)
            .get(`/api/articles/${article.get('slug')}/comments`)
            .set('Accept', 'application/json')
            .send();

          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({
            comments: [
              {
                author: {
                  bio: author.get('bio'),
                  following: false,
                  image: author.get('image'),
                  username: author.get('username'),
                },
                body: comment.get('body'),
                createdAt: moment(comment.get('created_at')).toISOString(),
                id: comment.id,
                updatedAt: moment(comment.get('updated_at')).toISOString(),
              },
            ],
          });
        });
      });
    });

    describe('with a logged in user', () => {
      describe('and a valid article slug', () => {
        test(`should return the article's comments`, async () => {
          const response = await request(app)
            .get(`/api/articles/${article.get('slug')}/comments`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${author.generateJWT()}`)
            .send();

          expect(response.statusCode).toBe(200);
          expect(response.body).toEqual({
            comments: [
              {
                author: {
                  bio: author.get('bio'),
                  following: false,
                  image: author.get('image'),
                  username: author.get('username'),
                },
                body: comment.get('body'),
                createdAt: moment(comment.get('created_at')).toISOString(),
                id: comment.id,
                updatedAt: moment(comment.get('updated_at')).toISOString(),
              },
            ],
          });
        });
      });
    });
  });

  describe('POST /api/articles/:slug/comments', () => {
    describe('without a valid token', () => {
      test('should return a 401', async () => {
        const response = await request(app)
          .post(`/api/articles/${article.get('slug')}/comments`)
          .set('Accept', 'application/json')
          .send();

        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('with a valid token', () => {
      describe('and the user is not found', () => {
        test('should return a 404', async () => {
          const unsavedUser = await new User({
            bio: chance.profession(),
            email: chance.email(),
            id: 9999,
            image: chance.avatar(),
            password: chance.word({length: 8}),
            username: chance.word(),
          });

          const response = await request(app)
            .post(`/api/articles/${article.get('slug')}/comments`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${unsavedUser.generateJWT()}`)
            .send();

          expect(response.statusCode).toBe(404);
          expect(response.body).toMatchSnapshot();
        });
      });

      describe('and the user is found', () => {
        describe('and invalid body params are passed', () => {
          test('should return a 422', async () => {
            const response = await request(app)
              .post(`/api/articles/${article.get('slug')}/comments`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${user.generateJWT()}`)
              .send();

            expect(response.statusCode).toBe(422);
            expect(response.body).toMatchSnapshot();
          });
        });

        describe('and valid body params are passed', () => {
          test('should return a 200', async () => {
            const body = chance.paragraph({sentences: 2});

            const response = await request(app)
              .post(`/api/articles/${article.get('slug')}/comments`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${user.generateJWT()}`)
              .send({
                comment: {
                  body,
                },
              });

            expect(response.statusCode).toBe(200);
            expect(response.body).toEqual({
              comment: {
                author: {
                  bio: user.get('bio'),
                  following: false,
                  image: user.get('image'),
                  username: user.get('username'),
                },
                body,
                createdAt: expect.any(String),
                id: expect.any(Number),
                updatedAt: expect.any(String),
              },
            });
          });
        });
      });
    });
  });

  describe('DELETE /api/articles/:slug/comments/:id', () => {
    describe('without a valid token', () => {
      test('should return a 401', async () => {
        const response = await request(app)
          .delete(`/api/articles/${article.get('slug')}/comments/${comment.id}`)
          .set('Accept', 'application/json')
          .send();

        expect(response.statusCode).toBe(401);
        expect(response.body).toMatchSnapshot();
      });
    });

    describe('with a valid token', () => {
      describe('and the user is not found', () => {
        test('should return a 404', async () => {
          const unsavedUser = await new User({
            bio: chance.profession(),
            email: chance.email(),
            id: 9999,
            image: chance.avatar(),
            password: chance.word({length: 8}),
            username: chance.word(),
          });

          const response = await request(app)
            .delete(
              `/api/articles/${article.get('slug')}/comments/${comment.id}`,
            )
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${unsavedUser.generateJWT()}`)
            .send();

          expect(response.statusCode).toBe(404);
          expect(response.body).toMatchSnapshot();
        });
      });

      describe('and the user is found', () => {
        describe('and the comment is not found', () => {
          test('should return a 404', async () => {
            const response = await request(app)
              .delete(`/api/articles/${article.get('slug')}/comments/9999`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${author.generateJWT()}`)
              .send();

            expect(response.statusCode).toBe(404);
            expect(response.body).toMatchSnapshot();
          });
        });

        describe('and the comment is found', () => {
          describe('and the user is not the comment author', () => {
            test('should return a 403', async () => {
              const response = await request(app)
                .delete(
                  `/api/articles/${article.get('slug')}/comments/${comment.id}`,
                )
                .set('Accept', 'application/json')
                .set('Authorization', `Token ${user.generateJWT()}`)
                .send();

              expect(response.statusCode).toBe(403);
              expect(response.body).toMatchSnapshot();
            });
          });

          describe('and the user is the comment author', () => {
            test('should return a 200', async () => {
              const response = await request(app)
                .delete(
                  `/api/articles/${article.get('slug')}/comments/${comment.id}`,
                )
                .set('Accept', 'application/json')
                .set('Authorization', `Token ${author.generateJWT()}`)
                .send();

              expect(response.statusCode).toBe(200);
              expect(response.body).toMatchSnapshot();
            });
          });
        });
      });
    });
  });
});
