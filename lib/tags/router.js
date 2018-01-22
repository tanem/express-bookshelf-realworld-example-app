'use strict';

const router = require('express').Router();
const {index} = require('./controller');

router.get('/api/tags', index);

module.exports = router;
