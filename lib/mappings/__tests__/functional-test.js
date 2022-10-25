'use strict';

const chance = require('chance').Chance('mapping');
const moment = require('moment');
const request = require('supertest');
const app = require('../../app');

const {mappings, mappingsTags, favorites, followers, tags, users} =
  app.locals.services;

describe('mappings', () => {
  let author;
  let nonAuthor;
  let mapping;
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
    mapping = await mappings.create({
      author: author.id,
      version: chance.sentence({words: 3}),
      keyword: chance.sentence({words: 3}),
      child_of: chance.sentence({words: 3}),
      parent_of: chance.sentence({words: 3}),
      mapper_code: chance.paragraph({sentences: 10}),
    });
    await favorites.create({
      user: nonAuthor.id,
      mapping: mapping.id,
    });
    await followers.create({
      user: author.id,
      follower: nonAuthor.id,
    });
    tagOne = await tags.create({name: chance.word()});
    tagTwo = await tags.create({name: chance.word()});
    await mappingsTags.create({mapping: mapping.id, tag: tagOne.id});
    await mappingsTags.create({mapping: mapping.id, tag: tagTwo.id});
  });

  describe('GET /api/mappings/feed', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .get('/api/mappings/feed')
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      test('should return the mapping feed', async () => {
        const {body, status} = await request(app)
          .get('/api/mappings/feed')
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${users.generateJWT(nonAuthor)}`)
          .send();

        expect(status).toBe(200);
        expect(body).toEqual({
          mappings: [
            {
              author: {
                bio: author.get('bio'),
                following: true,
                image: author.get('image'),
                username: author.get('username'),
              },
              version: mapping.get('version'),
              createdAt: moment(mapping.get('created_at')).toISOString(),
              keyword: mapping.get('keyword'),
              child_of: mapping.get('child_of'),
              parent_of: mapping.get('parent_of'),
              favorited: true,
              favoritesCount: 1,
              slug: mapping.get('slug'),
              tagList: [tagOne.get('name'), tagTwo.get('name')],
              mapper_code: mapping.get('mapper_code'),
              updatedAt: moment(mapping.get('updated_at')).toISOString(),
            },
          ],
          mappingsCount: 1,
        });
      });
    });
  });

  describe('GET /api/mappings', () => {
    describe('when the user is not authenticated', () => {
      test('should return all mappings', async () => {
        const {body, status} = await request(app)
          .get('/api/mappings')
          .set('Accept', 'application/json')
          .query({
            author: author.get('username'),
            favorited: nonAuthor.get('username'),
            tag: tagOne.get('name'),
          })
          .send();

        expect(status).toBe(200);
        expect(body).toEqual({
          mappings: [
            {
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
              favoritesCount: 1,
              slug: mapping.get('slug'),
              tagList: [tagOne.get('name'), tagTwo.get('name')],
              mapper_code: mapping.get('mapper_code'),
              updatedAt: moment(mapping.get('updated_at')).toISOString(),
            },
          ],
          mappingsCount: 1,
        });
      });
    });

    describe('when the user is authenticated', () => {
      test('should return all mappings', async () => {
        const {body, status} = await request(app)
          .get('/api/mappings')
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${users.generateJWT(nonAuthor)}`)
          .query({
            author: author.get('username'),
            favorited: nonAuthor.get('username'),
            tag: tagOne.get('name'),
          })
          .send();

        expect(status).toBe(200);
        expect(body).toEqual({
          mappings: [
            {
              author: {
                bio: author.get('bio'),
                following: true,
                image: author.get('image'),
                username: author.get('username'),
              },
              version: mapping.get('version'),
              createdAt: moment(mapping.get('created_at')).toISOString(),
              keyword: mapping.get('keyword'),
              child_of: mapping.get('child_of'),
              parent_of: mapping.get('parent_of'),
              favorited: true,
              favoritesCount: 1,
              slug: mapping.get('slug'),
              tagList: [tagOne.get('name'), tagTwo.get('name')],
              mapper_code: mapping.get('mapper_code'),
              updatedAt: moment(mapping.get('updated_at')).toISOString(),
            },
          ],
          mappingsCount: 1,
        });
      });
    });
  });

  describe('POST /api/mappings', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .post('/api/mappings')
          .set('Accept', 'application/json')
          .send({
            mapping: {
              title: chance.word(),
            },
          });

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      test('should create an mapping', async () => {
        version: chance.sentence({words: 3});
        keyword: chance.sentence({words: 3});
        child_of: chance.sentence({words: 3});
        parent_of: chance.sentence({words: 3});
        mapper_code: chance.paragraph({sentences: 10});
        const {body, status} = await request(app)
          .post('/api/mappings')
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${users.generateJWT(author)}`)
          .send({
            mapping: {
              mapper_code: mapper_code,
              version,
              keyword,
              child_of,
              parent_of,
            },
          });

        expect(status).toBe(201);
        expect(body).toEqual({
          mapping: {
            author: {
              bio: author.get('bio'),
              following: false,
              image: author.get('image'),
              username: author.get('username'),
            },
            mapper_code: mapper_code,
            createdAt: any.isISO8601(),
            version,
            keyword,
            child_of,
            parent_of,
            favorited: false,
            favoritesCount: 0,
            slug: expect.stringMatching(
              new RegExp(`^(?:[a-z]+-){3}[a-z0-9]{6}$`),
            ),
            tagList: [],
            title,
            updatedAt: any.isISO8601(),
          },
        });
      });
    });
  });

  describe('GET /api/mappings/:slug', () => {
    describe('when the user is authenticated', () => {
      describe('and the mapping is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .get('/api/mappings/invalid')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(author)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the mapping is found', () => {
        test('should return the mapping', async () => {
          const {body, status} = await request(app)
            .get(`/api/mappings/${mapping.get('slug')}`)
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
              favorited: true,
              favoritesCount: 1,
              slug: mapping.get('slug'),
              tagList: [tagOne.get('name'), tagTwo.get('name')],
              mapper_code: mapping.get('mapper_code'),
              updatedAt: moment(mapping.get('updated_at')).toISOString(),
            },
          });
        });
      });
    });

    describe('when the user is not authenticated', () => {
      describe('and the mapping is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .get('/api/mappings/invalid')
            .set('Accept', 'application/json')
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the mapping is found', () => {
        test('should return the mapping', async () => {
          const {body, status} = await request(app)
            .get(`/api/mappings/${mapping.get('slug')}`)
            .set('Accept', 'application/json')
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
              favoritesCount: 1,
              slug: mapping.get('slug'),
              tagList: [tagOne.get('name'), tagTwo.get('name')],
              mapper_code: mapping.get('mapper_code'),
              updatedAt: moment(mapping.get('updated_at')).toISOString(),
            },
          });
        });
      });
    });
  });

  describe('PUT /api/mappings/:slug', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .put('/api/mappings/slug')
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and the mapping is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .put('/api/mappings/invalid-slug')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(author)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the mapping is found', () => {
        describe('and the user is the mapping author', () => {
          test('should return a 200', async () => {
            version: chance.sentence({words: 3});
            keyword: chance.sentence({words: 3});
            child_of: chance.sentence({words: 3});
            parent_of: chance.sentence({words: 3});
            mapper_code: chance.paragraph({sentences: 10});
            const {body: responseBody, status} = await request(app)
              .put(`/api/mappings/${mapping.get('slug')}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${users.generateJWT(author)}`)
              .send({
                mapping: {
                    version,
                    keyword,
                    child_of,
                    parent_of,
                    mapper_code,
                },
              });

            expect(status).toBe(200);
            expect(responseBody).toEqual({
              mapping: {
                author: {
                  bio: author.get('bio'),
                  following: false,
                  image: author.get('image'),
                  username: author.get('username'),
                },
                version,
                keyword,
                createdAt: moment(mapping.get('created_at')).toISOString(),
                child_of,
                parent_of,
                favorited: false,
                favoritesCount: 1,
                slug: mapping.get('slug'),
                tagList: [tagOne.get('name'), tagTwo.get('name')],
                mapper_code,
                updatedAt: any.isISO8601(),
              },
            });
          });
        });

        describe('and the user is not the mapping author', () => {
          test('should return a forbidden error', async () => {
            const {body, status} = await request(app)
              .put(`/api/mappings/${mapping.get('slug')}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${users.generateJWT(nonAuthor)}`)
              .send({
                mapping: {
                  mapper_code: chance.sentence(),
                },
              });

            expect({body, status}).toMatchSnapshot();
          });
        });
      });
    });
  });

  describe('DELETE /api/mappings/:slug', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .delete('/api/mappings/slug')
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and the mapping is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .delete('/api/mappings/invalid-slug')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(author)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the mapping is found', () => {
        describe('and the user is the mapping author', () => {
          test('should delete the mapping', async () => {
            const {body, status} = await request(app)
              .delete(`/api/mappings/${mapping.get('slug')}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${users.generateJWT(author)}`)
              .send();

            expect({body, status}).toMatchSnapshot();
          });
        });

        describe('and the user is not the mapping author', () => {
          test('should return a forbidden error', async () => {
            const {body, status} = await request(app)
              .delete(`/api/mappings/${mapping.get('slug')}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${users.generateJWT(nonAuthor)}`)
              .send();

            expect({body, status}).toMatchSnapshot();
          });
        });
      });
    });
  });
});
