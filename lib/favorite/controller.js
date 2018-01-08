'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;
const User = require('../user/model');
const Favorite = require('./model');

exports.favorite = errorCatcher(async (req, res) => {
  const {payload: {id} = {}} = req;
  const {locals: {article} = {}} = res;
  const user = await new User({id}).fetch();
  await new Favorite({user: id, article: article.id}).save();
  await article.load(['favoritedBy']);
  res.json({article: article.getJSON(user)});
});

exports.unfavorite = errorCatcher(async (req, res) => {
  const {payload: {id} = {}} = req;
  const {locals: {article} = {}} = res;
  const favorite = await new Favorite({user: id, article: article.id}).fetch();
  if (!favorite) throw Boom.notFound('article not favorited');
  const user = await new User({id}).fetch();
  await favorite.destroy();
  await article.load(['favoritedBy']);
  res.json({article: article.getJSON(user)});
});
