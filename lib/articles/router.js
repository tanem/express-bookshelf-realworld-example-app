'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const {create, del, feed, index, show, update} = require('./controller');
const {createTransaction, handleSlug, jwtAuth} = require('../middleware');
const {isArticleAuthor} = require('./middleware');

const router = express.Router();

router.post(
  '/api/articles',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  create,
);
router.get('/api/articles/feed', jwtAuth.required, feed);
router.get('/api/articles/:slug', jwtAuth.optional, handleSlug, show);
router.get('/api/articles', jwtAuth.optional, index);
router.put(
  '/api/articles/:slug',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleSlug,
  isArticleAuthor,
  update,
);
router.delete(
  '/api/articles/:slug',
  createTransaction,
  jwtAuth.required,
  handleSlug,
  isArticleAuthor,
  del,
);

module.exports = router;
