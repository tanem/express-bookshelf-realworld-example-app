'use strict';

const express = require('express');
const {create, del, show, update} = require('./controller');
const {handleSlug, jwtAuth} = require('../middleware');
const {isArticleAuthor} = require('./middleware');

const router = express.Router();

router.post('/api/articles', jwtAuth.required, create);
router.get('/api/articles/:slug', jwtAuth.optional, handleSlug, show);
router.put(
  '/api/articles/:slug',
  jwtAuth.required,
  handleSlug,
  isArticleAuthor,
  update,
);
router.delete(
  '/api/articles/:slug',
  jwtAuth.required,
  handleSlug,
  isArticleAuthor,
  del,
);

module.exports = router;
