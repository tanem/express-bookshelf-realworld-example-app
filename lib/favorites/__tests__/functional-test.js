'use strict';

const chance = require('chance').Chance('favorite');
const moment = require('moment');
const request = require('supertest');
const app = require('../../app');

const {mappings, favorites, users} = app.locals.services;

describe('favorites', () => {
  let user;
  let author;
  let mapping;

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
    await favorites.create({
      user: author.id,
      mapping: mapping.id,
    });
  });

  describe('POST /api/mappings/:slug/favorite', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .post(`/api/mappings/${mapping.get('slug')}/favorite`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and the mapping is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .post('/api/mappings/invalid-slug/favorite')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(user)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the mapping is found', () => {
        test('should favorite the mapping', async () => {
          const {body, status} = await request(app)
            .post(`/api/mappings/${mapping.get('slug')}/favorite`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(user)}`)
            .send();

          expect(status).toBe(200);
          expect(body).toEqual({
            mapping: {
              author: {
                bio: author.get('bio'),
                following: false,
                image: author.get('image'),
                username: author.get('username'),
              },
              version: mapping.get('version'),
              createdAt: moment(mapping.get('created_at')).toISOString(),
              keyword: mapping.get('keyword'),
              child_of: mapping.get('child_of'),
              parent_of: mapping.get('parent_of'),
              favorited: true,
              favoritesCount: 2,
              slug: mapping.get('slug'),
              tagList: [],
              mapper_code: mapping.get('mapper_code'),
              updatedAt: moment(mapping.get('updated_at')).toISOString(),
            },
          });
        });
      });
    });
  });

  describe('DELETE /api/mappings/:slug/favorite', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .delete(`/api/mappings/${mapping.get('slug')}/favorite`)
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and the mapping is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .delete('/api/mappings/invalid-slug/favorite')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(author)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the mapping is found', () => {
        test('should unfavorite the mapping', async () => {
          const {body, status} = await request(app)
            .delete(`/api/mappings/${mapping.get('slug')}/favorite`)
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(author)}`)
            .send();

          expect(status).toBe(200);
          expect(body).toEqual({
            mapping: {
              author: {
                bio: author.get('bio'),
                following: false,
                image: author.get('image'),
                username: author.get('username'),
              },
              version: mapping.get('version'),
              createdAt: moment(mapping.get('created_at')).toISOString(),
              keyword: mapping.get('keyword'),
              child_of: mapping.get('child_of'),
              parent_of: mapping.get('parent_of'),
              favorited: false,
              favoritesCount: 0,
              slug: mapping.get('slug'),
              tagList: [],
              mapper_code: mapping.get('mapper_code'),
              updatedAt: moment(mapping.get('updated_at')).toISOString(),
            },
          });
        });
      });
    });
  });
});
