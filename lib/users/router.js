'use strict';

const bodyParser = require('body-parser');
const router = require('express').Router();
const {createTransaction, jwtAuth, localAuth} = require('../middleware');
const {create, login, get, update} = require('./controller');

router.post('/api/users', bodyParser.json(), createTransaction, create);
router.post(
  '/api/users/login',
  bodyParser.json(),
  createTransaction,
  localAuth,
  login,
);
router.get('/api/user', jwtAuth.required, get);
router.put(
  '/api/user',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  update,
);

module.exports = router;
