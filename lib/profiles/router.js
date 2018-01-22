'use strict';

const router = require('express').Router();
const {auth, handleUsername} = require('../middleware');
const {get} = require('./controller');

router.get('/api/profiles/:username', auth.optional, handleUsername, get);

module.exports = router;
