'use strict';

const router = require('express').Router();
const {authRequired, authOptional} = require('../middleware');
const {create, del, index} = require('./controller');
const {handleSlug} = require('../article/middleware');
const {handleCommentId} = require('./middleware');

// TODO: This API feels very awkward but we need to conform to the realworld
// API. Can't hurt to explain the awkwardness in the README at some point.
// (Better off with /api/comments/{id} etc...)
router.get('/api/articles/:slug/comments', authOptional, handleSlug, index);
router.post('/api/articles/:slug/comments', authRequired, handleSlug, create);
router.delete(
  '/api/articles/:slug/comments/:commentId',
  authRequired,
  // handleSlug,
  handleCommentId,
  del,
);

module.exports = router;
