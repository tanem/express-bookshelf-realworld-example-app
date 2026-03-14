'use strict';

const express = require('express');
const router = express.Router();
const {createTransaction, jwtAuth, localAuth} = require('../middleware');
const {create, login, get, update} = require('./controller');

router.post('/api/users', express.json(), createTransaction, create);
router.post(
  '/api/users/login',
  express.json(),
  createTransaction,
  localAuth,
  login,
);
router.get('/api/user', jwtAuth.required, get);
router.put(
  '/api/user',
  express.json(),
  createTransaction,
  jwtAuth.required,
  update,
);

module.exports = router;
