'use strict';

const router = require('express').Router();
const {authRequired, handleUsername} = require('../middleware');
const {create, del} = require('./controller');

router.post(
  '/api/profiles/:username/follow',
  authRequired,
  handleUsername,
  create,
);
router.delete(
  '/api/profiles/:username/follow',
  authRequired,
  handleUsername,
  del,
);

module.exports = router;
