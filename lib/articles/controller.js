'use strict';

const errorCatcher = require('async-error-catcher').default;

exports.create = errorCatcher(async (req, res) => {
  const {body: {article: payload} = {}, user} = req;
  const {app: {locals: {services: {articles}}}} = res;

  const article = await articles.create({...payload, author: user.id});

  res.status(201).json({article: await articles.toJSON(article, user)});
});

exports.show = errorCatcher(async (req, res) => {
  const {user} = req;
  const {app: {locals: {services: {articles}}}, locals: {article} = {}} = res;

  res.json({article: await articles.toJSON(article, user)});
});

exports.update = errorCatcher(async (req, res) => {
  const {body: {article: payload} = {}, user} = req;
  const {app: {locals: {services: {articles}}}, locals: {article} = {}} = res;

  const updatedArticle = await articles.update(article, payload);

  res.json({article: await articles.toJSON(updatedArticle, user)});
});

exports.del = errorCatcher(async (req, res) => {
  const {app: {locals: {services: {articles}}}, locals: {article} = {}} = res;

  await articles.del(article);

  res.sendStatus(200);
});
