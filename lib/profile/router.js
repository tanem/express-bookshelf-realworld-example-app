const router = require('express').Router();
const {get, handleUsername} = require('./controller');
const {authOptional} = require('../middleware');

router.param('username', handleUsername);
router.get('/api/profiles/:username', authOptional, get);

module.exports = router;
