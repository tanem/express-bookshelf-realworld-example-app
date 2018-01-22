'use strict';

const router = require('express').Router();
const {auth, handleUsername} = require('../middleware');
const {create, del} = require('./controller');

router.post(
  '/api/profiles/:username/follow',
  auth.required,
  handleUsername,
  create,
);
router.delete(
  '/api/profiles/:username/follow',
  auth.required,
  handleUsername,
  del,
);

module.exports = router;
