'use strict';

const router = require('express').Router();
const {createTransaction, jwtAuth, localAuth} = require('../middleware');
const {create, login, get, update} = require('./controller');

router.post('/api/users', createTransaction, create);
router.post('/api/users/login', createTransaction, localAuth, login);
router.get('/api/user', jwtAuth.required, get);
router.put('/api/user', createTransaction, jwtAuth.required, update);

module.exports = router;
