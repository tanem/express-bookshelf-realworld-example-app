'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;
const User = require('../user/model');
const Article = require('./model');

exports.create = errorCatcher(async (req, res) => {
  const {body: {article: bodyArticle} = {}, payload: {id} = {}} = req;
  const user = await new User({id}).fetch();
  if (!user) throw Boom.notFound();
  const article = new Article({...bodyArticle, author: id});
  await article.save();
  await article.load(['author', 'favoritedBy']);
  res.status(201).json({article: article.getJSON(user)});
});

exports.get = errorCatcher(async (req, res) => {
  const {payload: {id} = {}} = req;
  const {locals: {article} = {}} = res;
  let user;
  if (id) user = await new User({id}).fetch();
  res.json({article: article.getJSON(user)});
});

exports.update = errorCatcher(async (req, res) => {
  const {
    body: {article: {body, description, title} = {}} = {},
    payload: {id} = {},
  } = req;
  const {locals: {article} = {}} = res;
  const user = await new User({id}).fetch();
  if (article.get('author') !== user.id) throw Boom.forbidden();
  await article.save({
    ...(body ? {body} : {}),
    ...(description ? {description} : {}),
    ...(title ? {title} : {}),
  });
  res.json({article: article.getJSON(user)});
});

exports.del = errorCatcher(async (req, res) => {
  const {payload: {id} = {}} = req;
  const {locals: {article} = {}} = res;
  const user = await new User({id}).fetch();
  if (article.get('author') !== user.id) throw Boom.forbidden();
  await article.destroy();
  res.sendStatus(200);
});
