'use strict';

const errorCatcher = require('async-error-catcher').default;

exports.create = errorCatcher(async (req, res) => {
  const {user: authenticatedUser} = req;
  const {
    app: {
      locals: {
        services: {followers, users},
      },
    },
    locals: {trx, user: userToFollow} = {},
  } = res;

  await followers.create(
    {
      user: userToFollow.id,
      follower: authenticatedUser.id,
    },
    {trx},
  );

  const profileJSON = await users.getProfileJSON(
    userToFollow,
    authenticatedUser,
    {trx},
  );

  res.json({
    profile: profileJSON,
  });
});

exports.del = errorCatcher(async (req, res) => {
  const {user: authenticatedUser} = req;
  const {
    app: {
      locals: {
        services: {followers, users},
      },
    },
    locals: {trx, user: userToUnfollow} = {},
  } = res;

  const follower = await followers.fetch(
    {
      user: userToUnfollow.id,
      follower: authenticatedUser.id,
    },
    {trx},
  );
  await followers.del(follower, {trx});

  const profileJSON = await users.getProfileJSON(
    userToUnfollow,
    authenticatedUser,
    {
      trx,
    },
  );

  res.json({
    profile: profileJSON,
  });
});
