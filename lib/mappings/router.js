'use strict';

const bodyParser = require('body-parser'); // parsing the incoming request
const express = require('express'); //?
const {create, del, feed, index, show, update} = require('./controller');
const {createTransaction, handleSlug, jwtAuth} = require('../middleware');
const {isMappingAuthor} = require('./middleware');

const router = express.Router();

router.post(
    '/api/mappings',
    bodyParser.json(),
    createTransaction,
    jwtAuth.required,
    create,    
);

router.get('/api/mappings/feed', jwtAuth.required, feed); //displayes feed as per authenticated user
router.get('/api/mappings/:slug', jwtAuth.optional, handleSlug, show); //? (what if user authentication isn't provided)
router.get('/api/mappings', jwtAuth.optional, index); // uses query parameters

router.patch(
    '/api/mappings/:slug',
    bodyParser.json(),
    createTransaction,
    jwtAuth.required,
    handleSlug,
    isMappingAuthor,
    update,
); 

router.delete(
    '/api/mappings/:slug',
    createTransaction,
    jwtAuth.required,
    handleSlug,
    isMappingAuthor,
    del,
);

module.exports = router ;