'use strict';

const router = require('express').Router();
const {handleUsername, jwtAuth} = require('../middleware');
const {create, del} = require('./controller');

router.post(
  '/api/profiles/:username/follow',
  jwtAuth.required,
  handleUsername,
  create,
);
router.delete(
  '/api/profiles/:username/follow',
  jwtAuth.required,
  handleUsername,
  del,
);

module.exports = router;
