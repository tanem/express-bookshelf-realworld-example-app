'use strict';

const chance = require('chance').Chance('article');
const moment = require('moment');
const request = require('supertest');
const app = require('../../app');

const {articles, articlesTags, favorites, followers, tags, users} =
  app.locals.services;

describe('articles', () => {
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
    await favorites.create({
      user: nonAuthor.id,
      article: article.id,
    });
    await followers.create({
      user: author.id,
      follower: nonAuthor.id,
    });
    tagOne = await tags.create({name: chance.word()});
    tagTwo = await tags.create({name: chance.word()});
    await articlesTags.create({article: article.id, tag: tagOne.id});
    await articlesTags.create({article: article.id, tag: tagTwo.id});
  });

  describe('GET /api/articles/feed', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .get('/api/articles/feed')
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      test('should return the article feed', async () => {
        const {body, status} = await request(app)
          .get('/api/articles/feed')
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${users.generateJWT(nonAuthor)}`)
          .send();

        expect(status).toBe(200);
        expect(body).toEqual({
          articles: [
            {
              author: {
                bio: author.get('bio'),
                following: true,
                image: author.get('image'),
                username: author.get('username'),
              },
              body: article.get('body'),
              createdAt: moment(article.get('created_at')).toISOString(),
              description: article.get('description'),
              favorited: true,
              favoritesCount: 1,
              slug: article.get('slug'),
              tagList: [tagOne.get('name'), tagTwo.get('name')],
              title: article.get('title'),
              updatedAt: moment(article.get('updated_at')).toISOString(),
            },
          ],
          articlesCount: 1,
        });
      });
    });
  });

  describe('GET /api/articles', () => {
    describe('when the user is not authenticated', () => {
      test('should return all articles', async () => {
        const {body, status} = await request(app)
          .get('/api/articles')
          .set('Accept', 'application/json')
          .query({
            author: author.get('username'),
            favorited: nonAuthor.get('username'),
            tag: tagOne.get('name'),
          })
          .send();

        expect(status).toBe(200);
        expect(body).toEqual({
          articles: [
            {
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
              favoritesCount: 1,
              slug: article.get('slug'),
              tagList: [tagOne.get('name'), tagTwo.get('name')],
              title: article.get('title'),
              updatedAt: moment(article.get('updated_at')).toISOString(),
            },
          ],
          articlesCount: 1,
        });
      });
    });

    describe('when the user is authenticated', () => {
      test('should return all articles', async () => {
        const {body, status} = await request(app)
          .get('/api/articles')
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
          articles: [
            {
              author: {
                bio: author.get('bio'),
                following: true,
                image: author.get('image'),
                username: author.get('username'),
              },
              body: article.get('body'),
              createdAt: moment(article.get('created_at')).toISOString(),
              description: article.get('description'),
              favorited: true,
              favoritesCount: 1,
              slug: article.get('slug'),
              tagList: [tagOne.get('name'), tagTwo.get('name')],
              title: article.get('title'),
              updatedAt: moment(article.get('updated_at')).toISOString(),
            },
          ],
          articlesCount: 1,
        });
      });
    });
  });

  describe('POST /api/articles', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .post('/api/articles')
          .set('Accept', 'application/json')
          .send({
            article: {
              title: chance.word(),
            },
          });

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      test('should create an article', async () => {
        const articleBody = chance.paragraph({sentences: 10});
        const description = chance.paragraph({sentences: 2});
        const title = chance.sentence({words: 3});
        const {body, status} = await request(app)
          .post('/api/articles')
          .set('Accept', 'application/json')
          .set('Authorization', `Token ${users.generateJWT(author)}`)
          .send({
            article: {
              body: articleBody,
              description,
              title,
            },
          });

        expect(status).toBe(201);
        expect(body).toEqual({
          article: {
            author: {
              bio: author.get('bio'),
              following: false,
              image: author.get('image'),
              username: author.get('username'),
            },
            body: articleBody,
            createdAt: any.isISO8601(),
            description,
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

  describe('GET /api/articles/:slug', () => {
    describe('when the user is authenticated', () => {
      describe('and the article is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .get('/api/articles/invalid')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(author)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the article is found', () => {
        test('should return the article', async () => {
          const {body, status} = await request(app)
            .get(`/api/articles/${article.get('slug')}`)
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
              favoritesCount: 1,
              slug: article.get('slug'),
              tagList: [tagOne.get('name'), tagTwo.get('name')],
              title: article.get('title'),
              updatedAt: moment(article.get('updated_at')).toISOString(),
            },
          });
        });
      });
    });

    describe('when the user is not authenticated', () => {
      describe('and the article is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .get('/api/articles/invalid')
            .set('Accept', 'application/json')
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the article is found', () => {
        test('should return the article', async () => {
          const {body, status} = await request(app)
            .get(`/api/articles/${article.get('slug')}`)
            .set('Accept', 'application/json')
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
              favoritesCount: 1,
              slug: article.get('slug'),
              tagList: [tagOne.get('name'), tagTwo.get('name')],
              title: article.get('title'),
              updatedAt: moment(article.get('updated_at')).toISOString(),
            },
          });
        });
      });
    });
  });

  describe('PUT /api/articles/:slug', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .put('/api/articles/slug')
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and the article is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .put('/api/articles/invalid-slug')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(author)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the article is found', () => {
        describe('and the user is the article author', () => {
          test('should return a 200', async () => {
            const body = chance.sentence();
            const description = chance.sentence();
            const title = chance.word();
            const {body: responseBody, status} = await request(app)
              .put(`/api/articles/${article.get('slug')}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${users.generateJWT(author)}`)
              .send({
                article: {
                  body,
                  description,
                  title,
                },
              });

            expect(status).toBe(200);
            expect(responseBody).toEqual({
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
                favorited: false,
                favoritesCount: 1,
                slug: article.get('slug'),
                tagList: [tagOne.get('name'), tagTwo.get('name')],
                title,
                updatedAt: any.isISO8601(),
              },
            });
          });
        });

        describe('and the user is not the article author', () => {
          test('should return a forbidden error', async () => {
            const {body, status} = await request(app)
              .put(`/api/articles/${article.get('slug')}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${users.generateJWT(nonAuthor)}`)
              .send({
                article: {
                  body: chance.sentence(),
                },
              });

            expect({body, status}).toMatchSnapshot();
          });
        });
      });
    });
  });

  describe('DELETE /api/articles/:slug', () => {
    describe('when the user is not authenticated', () => {
      test('should return an unauthorized error', async () => {
        const {body, status} = await request(app)
          .delete('/api/articles/slug')
          .set('Accept', 'application/json')
          .send();

        expect({body, status}).toMatchSnapshot();
      });
    });

    describe('when the user is authenticated', () => {
      describe('and the article is not found', () => {
        test('should return a not found error', async () => {
          const {body, status} = await request(app)
            .delete('/api/articles/invalid-slug')
            .set('Accept', 'application/json')
            .set('Authorization', `Token ${users.generateJWT(author)}`)
            .send();

          expect({body, status}).toMatchSnapshot();
        });
      });

      describe('and the article is found', () => {
        describe('and the user is the article author', () => {
          test('should delete the article', async () => {
            const {body, status} = await request(app)
              .delete(`/api/articles/${article.get('slug')}`)
              .set('Accept', 'application/json')
              .set('Authorization', `Token ${users.generateJWT(author)}`)
              .send();

            expect({body, status}).toMatchSnapshot();
          });
        });

        describe('and the user is not the article author', () => {
          test('should return a forbidden error', async () => {
            const {body, status} = await request(app)
              .delete(`/api/articles/${article.get('slug')}`)
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
