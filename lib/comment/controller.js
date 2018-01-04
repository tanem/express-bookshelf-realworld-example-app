'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;
const Comment = require('./model');
const User = require('../user/model');

exports.del = errorCatcher(async (req, res) => {
  const {payload: {id} = {}} = req;
  const {locals: {comment} = {}} = res;

  // TODO: Extract into middleware?
  const user = await new User({id}).fetch();
  if (!user) {
    throw Boom.notFound();
  }

  if (comment.get('author') !== user.id) {
    throw Boom.forbidden();
  }

  await comment.destroy();

  res.sendStatus(200);
});

exports.create = errorCatcher(async (req, res) => {
  const {
    body: {comment: {body: commentBody} = {}} = {},
    payload: {id} = {},
  } = req;
  const {locals: {article} = {}} = res;
  const user = await new User({id}).fetch();
  if (!user) throw Boom.notFound();
  const comment = new Comment({
    article: article.id,
    author: user.id,
    body: commentBody,
  });
  await comment.save();
  await comment.load(['author']);
  res.json({
    comment: comment.toJSONFor(user),
  });
});

exports.index = errorCatcher(async (req, res) => {
  const {payload: {id} = {}} = req;
  const {locals: {article} = {}} = res;
  let user;
  if (id) {
    user = new User({id}).fetch();
  }
  await article.load(['comments.author']);
  res.json({
    comments: article
      .related('comments')
      .map(comment => comment.toJSONFor(user)),
  });
});
