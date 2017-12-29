'use strict';

const router = require('express').Router();
const {authOptional, authRequired} = require('../middleware');
const {create, del, get, update} = require('./controller');
const {handleSlug} = require('./middleware');

router.post('/api/articles', authRequired, create);
router.get('/api/articles/:slug', authOptional, handleSlug, get);
router.put('/api/articles/:slug', authRequired, handleSlug, update);
router.delete('/api/articles/:slug', authRequired, handleSlug, del);

module.exports = router;
