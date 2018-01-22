'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;
const Follow = require('./model');
const {Model: User} = require('../user');

exports.create = errorCatcher(async (req, res) => {
  const {payload: {id} = {}} = req;
  const {locals: {user} = {}} = res;
  const loggedInUser = await new User({id}).fetch();
  if (!loggedInUser) throw Boom.notFound('user not found');
  await new Follow({user: user.id, follower: loggedInUser.id}).save();
  await loggedInUser.load(['following']);
  res.json({profile: user.toProfileJSONFor(loggedInUser)});
});

exports.del = errorCatcher(async (req, res) => {
  const {payload: {id} = {}} = req;
  const {locals: {user} = {}} = res;
  const loggedInUser = await new User({id}).fetch();
  if (!loggedInUser) throw Boom.notFound();
  const follow = await new Follow({
    user: user.id,
    follower: loggedInUser.id,
  }).fetch();
  if (!follow) throw Boom.notFound('user not being followed');
  await follow.destroy();
  await loggedInUser.load(['following']);
  res.json({profile: user.toProfileJSONFor(loggedInUser)});
});
