'use strict';

const errorCatcher = require('async-error-catcher').default;

exports.create = errorCatcher(async (req, res) => {
  const {body: {user: {email, password, username} = {}} = {}} = req;
  const {app: {locals: {services: {users}}}} = res;

  const user = await users.create({
    bio: null,
    email,
    image: null,
    username,
    password,
  });

  res.status(201).json({user: users.getAuthJSON(user)});
});

exports.login = (req, res) => {
  const {user} = req;
  const {app: {locals: {services: {users}}}} = res;

  res.json({user: users.getAuthJSON(user)});
};

exports.get = errorCatcher(async (req, res) => {
  const {user} = req;
  const {app: {locals: {services: {users}}}} = res;

  res.json({user: users.getAuthJSON(user)});
});

exports.update = errorCatcher(async (req, res) => {
  const {
    body: {user: {bio, email, image, password, username} = {}} = {},
    user,
  } = req;
  const {app: {locals: {services: {users}}}} = res;

  const updatedUser = await users.update(user, {
    ...(username ? {username} : {}),
    ...(email ? {email} : {}),
    ...(bio ? {bio} : {}),
    ...(image ? {image} : {}),
    ...(password ? {password} : {}),
  });

  res.json({user: users.getAuthJSON(updatedUser)});
});
