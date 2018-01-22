'use strict';

const router = require('express').Router();
const {handleSlug, jwtAuth} = require('../middleware');
const {favorite, unfavorite} = require('./controller');

router.post(
  '/api/articles/:slug/favorite',
  jwtAuth.required,
  handleSlug,
  favorite,
);
router.delete(
  '/api/articles/:slug/favorite',
  jwtAuth.required,
  handleSlug,
  unfavorite,
);

module.exports = router;
