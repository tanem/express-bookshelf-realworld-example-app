'use strict';

const chance = require('chance').Chance('comment');
const moment = require('moment');
const request = require('supertest');
const app = require('../../app');

const {mappings, comments, users} = app.locals.services;

describe('comments', () => {
  let user;
  let author;
  let mapping;
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
    mapping = await mappings.create({
      author: author.id,
      version: chance.sentence({words: 3}),
      keyword: chance.sentence({words: 3}),
      child_of: chance.sentence({words: 3}),
      parent_of: chance.sentence({words: 3}),
      mapper_code: chance.paragraph({sentences: 10}),
    });
    comment = await comments.create({
      mapping: mapping.id,
      author: author.id,
      body: chance.paragraph({sentences: 2}),
    });
  });

  describe('GET /api/mappings/:slug/comments', () => {
    describe('when the slug is not found', () => {
      test('should return a not found error', async () => {
        const {body, status} = await request(app)
          .get('/api/mappings/invalid-slug/comments')
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is not authenticated', () => {
      describe('and the slug is found', () => {
        test(`should return the mapping's comments`, async () => {
          const {body, status} = await request(app)
            .get(`/api/mappings/${mapping.get('slug')}/comments`)
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

    describe('when the user is authenticated', () => {
      describe('and the slug is found', () => {
        test(`should return the mapping's comments`, async () => {
          const {body, status} = await request(app)
            .get(`/api/mappings/${mapping.get('slug')}/comments`)
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

  describe('POST /api/mappings/:slug/comments', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .post(`/api/mappings/${mapping.get('slug')}/comments`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and invalid body params are passed', () => {
        test('should return an unprocessable entity error', async () => {
          const {body, status} = await request(app)
            .post(`/api/mappings/${mapping.get('slug')}/comments`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(user)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and valid body params are passed', () => {
        test('should create a comment for an mapping', async () => {
          const body = chance.paragraph({sentences: 2});

          const {body: responseBody, status} = await request(app)
            .post(`/api/mappings/${mapping.get('slug')}/comments`)
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

  describe('DELETE /api/mappings/:slug/comments/:id', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .delete(`/api/mappings/${mapping.get('slug')}/comments/${comment.id}`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and the comment is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .delete(`/api/mappings/${mapping.get('slug')}/comments/9999`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(author)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the comment is found', () => {
        describe('and the user is not the comment author', () => {
          test('should return a forbidden error', async () => {
            const {body, status} = await request(app)
              .delete(
                `/api/mappings/${mapping.get('slug')}/comments/${comment.id}`,
              )
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${users.generateJWT(user)}`)
              .send();

            expect({body, status}).toMatchSnapshot();
          });
        });

        describe('and the user is the comment author', () => {
          test('should delete the mapping comment', async () => {
            const {body, status} = await request(app)
              .delete(
                `/api/mappings/${mapping.get('slug')}/comments/${comment.id}`,
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
