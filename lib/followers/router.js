'use strict';

const bodyParser = require('body-parser');
const router = require('express').Router();
const {createTransaction, handleUsername, jwtAuth} = require('../middleware');
const {create, del} = require('./controller');

router.post(
  '/api/profiles/:username/follow',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleUsername,
  create,
);
router.delete(
  '/api/profiles/:username/follow',
  createTransaction,
  jwtAuth.required,
  handleUsername,
  del,
);

module.exports = router;
