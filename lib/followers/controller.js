'use strict';

const errorCatcher = require('async-error-catcher').default;

exports.create = errorCatcher(async (req, res) => {
  const {user: authenticatedUser} = req;
  const {
    app: {locals: {services: {followers, users}}},
    locals: {user: userToFollow} = {},
  } = res;

  await followers.create({
    user: userToFollow.id,
    follower: authenticatedUser.id,
  });

  res.json({profile: users.getProfileJSON(userToFollow, authenticatedUser)});
});

exports.del = errorCatcher(async (req, res) => {
  const {user: authenticatedUser} = req;
  const {
    app: {locals: {services: {followers, users}}},
    locals: {user: userToUnfollow} = {},
  } = res;

  const follower = await followers.fetch({
    user: userToUnfollow.id,
    follower: authenticatedUser.id,
  });
  await followers.del(follower);

  res.json({profile: users.getProfileJSON(userToUnfollow, authenticatedUser)});
});
