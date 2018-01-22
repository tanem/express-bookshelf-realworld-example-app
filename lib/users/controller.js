'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;
const passport = require('passport');
const User = require('./model');

exports.create = errorCatcher(async (req, res) => {
  const {body: {user: {email, password, username} = {}} = {}} = req;
  const user = new User({
    bio: null,
    email,
    image: null,
    username,
    password,
  });
  await user.save();
  res.status(201).json({user: user.getAuthJSON()});
});

exports.login = (req, res) => {
  res.json({user: req.user.getAuthJSON()});
};

exports.get = errorCatcher(async (req, res) => {
  const {payload: {id} = {}} = req;
  const user = await new User({id}).fetch();
  if (!user) throw Boom.notFound();
  return res.json({user: user.getAuthJSON()});
});

exports.update = errorCatcher(async (req, res) => {
  const {
    payload: {id} = {},
    body: {user: {bio, email, image, password, username} = {}} = {},
  } = req;
  const user = await new User({id}).fetch();
  if (!user) throw Boom.notFound();
  await user.save({
    ...(username ? {username} : {}),
    ...(email ? {email} : {}),
    ...(bio ? {bio} : {}),
    ...(image ? {image} : {}),
    ...(password ? {password} : {}),
  });
  res.json({user: user.getAuthJSON()});
});
