'use strict';

const errorCatcher = require('async-error-catcher').default;

exports.index = errorCatcher(async (req, res) => {
  const {user} = req;
  const {
    app: {
      locals: {
        services: {mappings},
      },
    },
    locals: {mapping} = {},
  } = res;

  const commentsJSON = await mappings.getCommentsJSON(mapping, user);

  res.json({comments: commentsJSON});
});

exports.create = errorCatcher(async (req, res) => {
  const {body: {comment: {body: commentBody} = {}} = {}, user} = req;
  const {
    app: {
      locals: {
        services: {comments},
      },
    },
    locals: {mapping, trx} = {},
  } = res;

  const comment = await comments.create(
    {
      mapping: mapping.id,
      author: user.id,
      body: commentBody,
    },
    {trx},
  );
  const commentJSON = await comments.toJSON(comment, user, {trx});

  res.json({comment: commentJSON});
});

exports.del = errorCatcher(async (req, res) => {
  const {
    app: {
      locals: {
        services: {comments},
      },
    },
    locals: {comment, trx} = {},
  } = res;

  await comments.del(comment, {trx});

  res.sendStatus(200);
});
