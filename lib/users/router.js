'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const {createTransaction, jwtAuth, localAuth} = require('../middleware');
const {create, login, get, update} = require('./controller');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  '/api/users',
  authLimiter,
  express.json(),
  createTransaction,
  create,
);
router.post(
  '/api/users/login',
  authLimiter,
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
