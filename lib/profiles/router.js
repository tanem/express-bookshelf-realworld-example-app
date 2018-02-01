'use strict';

const router = require('express').Router();
const {handleUsername, jwtAuth} = require('../middleware');
const {get} = require('./controller');

router.get('/api/profiles/:username', jwtAuth.optional, handleUsername, get);

module.exports = router;
