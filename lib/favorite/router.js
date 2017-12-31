'use strict';

const router = require('express').Router();
const {authRequired} = require('../middleware');
const {favorite, unfavorite} = require('./controller');
const {handleSlug} = require('../article/middleware');

router.post('/api/articles/:slug/favorite', authRequired, handleSlug, favorite);
router.delete(
  '/api/articles/:slug/favorite',
  authRequired,
  handleSlug,
  unfavorite,
);

module.exports = router;
