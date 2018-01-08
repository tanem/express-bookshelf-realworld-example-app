'use strict';

const router = require('express').Router();
const {authOptional, handleUsername} = require('../middleware');
const {get} = require('./controller');

router.get('/api/profiles/:username', authOptional, handleUsername, get);

module.exports = router;
