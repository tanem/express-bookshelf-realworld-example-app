'use strict';

const router = require('express').Router();
const {jwtAuth, localAuth} = require('../middleware');
const {create, login, get, update} = require('./controller');

router.post('/api/users', create);
router.post('/api/users/login', localAuth, login);
router.get('/api/user', jwtAuth.required, get);
router.put('/api/user', jwtAuth.required, update);

module.exports = router;
