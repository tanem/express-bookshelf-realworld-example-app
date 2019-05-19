'use strict';

const errorCatcher = require('async-error-catcher').default;

exports.get = errorCatcher(async (req, res) => {
  const {user: authenticatedUser} = req;
  const {
    app: {
      locals: {
        services: {users},
      },
    },
    locals: {user} = {},
  } = res;

  res.json({profile: await users.getProfileJSON(user, authenticatedUser)});
});
