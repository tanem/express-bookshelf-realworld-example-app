'use strict';

const bodyParser = require('body-parser');
const router = require('express').Router();
const {create, del, index} = require('./controller');
const {
  createTransaction,
  handleCommentId,
  handleSlug,
  jwtAuth,
} = require('../middleware');
const {isCommentAuthor} = require('./middleware');

router.get('/api/mappings/:slug/comments', jwtAuth.optional, handleSlug, index);
router.post(
  '/api/mappings/:slug/comments',
  bodyParser.json(),
  createTransaction,
  jwtAuth.required,
  handleSlug,
  create,
);
// We don't actually need to handle `:slug` here, but it's left in the endpoint
// so we adhere to the RealWorld spec. If that wasn't the case, then something
// like `DELETE /api/comments/:commentId` might be more appropriate.
router.delete(
  '/api/mappings/:slug/comments/:commentId',
  createTransaction,
  jwtAuth.required,
  handleCommentId,
  isCommentAuthor,
  del,
);

module.exports = router;
