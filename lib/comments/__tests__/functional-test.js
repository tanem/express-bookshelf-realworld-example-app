'use strict';

const chance = require('chance').Chance('comment');
const moment = require('moment');
const request = require('supertest');
const app = require('../../app');

const {User} = app.locals.models;
const {articles, comments, users} = app.locals.services;

describe('comments', () => {
  let user;
  let author;
  let article;
  let comment;

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
    comment = await comments.create({
      article: article.id,
      author: author.id,
      body: chance.paragraph({sentences: 2}),
    });
  });

  afterEach(async () => {
    await author.destroy();
    await user.destroy();
  });

  describe('GET /api/articles/:slug/comments', () => {
    describe('with an invalid slug', () => {
      test('should return a 404', async () => {
        const {body, status} = await request(app)
          .get('/api/articles/invalid-slug/comments')
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('without a logged in user', () => {
      describe('and a valid article slug', () => {
        test(`should return the article's comments`, async () => {
          const {body, status} = await request(app)
            .get(`/api/articles/${article.get('slug')}/comments`)
            .set('Accept', 'application/json')
            .send();

          expect(status).toBe(200);
          expect(body).toEqual({
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
          const {body, status} = await request(app)
            .get(`/api/articles/${article.get('slug')}/comments`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(author)}`)
            .send();

          expect(status).toBe(200);
          expect(body).toEqual({
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
        const {body, status} = await request(app)
          .post(`/api/articles/${article.get('slug')}/comments`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('with a valid token', () => {
      describe('and the user is not found', () => {
        test('should return a 401', async () => {
          const unsavedUser = await new User({
            bio: chance.profession(),
            email: chance.email(),
            id: 9999,
            image: chance.avatar(),
            password: chance.word({length: 8}),
            username: chance.word(),
          });

          const {body, status} = await request(app)
            .post(`/api/articles/${article.get('slug')}/comments`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(unsavedUser)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the user is found', () => {
        describe('and invalid body params are passed', () => {
          test('should return a 422', async () => {
            const {body, status} = await request(app)
              .post(`/api/articles/${article.get('slug')}/comments`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${users.generateJWT(user)}`)
              .send();

            expect({body, status}).toMatchSnapshot();
          });
        });

        describe('and valid body params are passed', () => {
          test('should return a 200', async () => {
            const body = chance.paragraph({sentences: 2});

            const {body: responseBody, status} = await request(app)
              .post(`/api/articles/${article.get('slug')}/comments`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${users.generateJWT(user)}`)
              .send({
                comment: {
                  body,
                },
              });

            expect(status).toBe(200);
            expect(responseBody).toEqual({
              comment: {
                author: {
                  bio: user.get('bio'),
                  following: false,
                  image: user.get('image'),
                  username: user.get('username'),
                },
                body,
                createdAt: any.isISO8601(),
                id: expect.any(Number),
                updatedAt: any.isISO8601(),
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
        const {body, status} = await request(app)
          .delete(`/api/articles/${article.get('slug')}/comments/${comment.id}`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('with a valid token', () => {
      describe('and the user is not found', () => {
        test('should return a 401', async () => {
          const unsavedUser = await new User({
            bio: chance.profession(),
            email: chance.email(),
            id: 9999,
            image: chance.avatar(),
            password: chance.word({length: 8}),
            username: chance.word(),
          });

          const {body, status} = await request(app)
            .delete(
              `/api/articles/${article.get('slug')}/comments/${comment.id}`,
            )
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(unsavedUser)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the user is found', () => {
        describe('and the comment is not found', () => {
          test('should return a 404', async () => {
            const {body, status} = await request(app)
              .delete(`/api/articles/${article.get('slug')}/comments/9999`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${users.generateJWT(author)}`)
              .send();

            expect({body, status}).toMatchSnapshot();
          });
        });

        describe('and the comment is found', () => {
          describe('and the user is not the comment author', () => {
            test('should return a 403', async () => {
              const {body, status} = await request(app)
                .delete(
                  `/api/articles/${article.get('slug')}/comments/${comment.id}`,
                )
                .set('Accept', 'application/json')
                .set('Authorization', `Token ${users.generateJWT(user)}`)
                .send();

              expect({body, status}).toMatchSnapshot();
            });
          });

          describe('and the user is the comment author', () => {
            test('should return a 200', async () => {
              const {body, status} = await request(app)
                .delete(
                  `/api/articles/${article.get('slug')}/comments/${comment.id}`,
                )
                .set('Accept', 'application/json')
                .set('Authorization', `Token ${users.generateJWT(author)}`)
                .send();

              expect({body, status}).toMatchSnapshot();
            });
          });
        });
      });
    });
  });
});
