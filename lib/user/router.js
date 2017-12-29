'use strict';

const router = require('express').Router();
const {create, login, get, update} = require('./controller');
const {authRequired} = require('../middleware');

router.post('/api/users', create);
router.post('/api/users/login', login);
router.get('/api/user', authRequired, get);
router.put('/api/user', authRequired, update);

module.exports = router;
