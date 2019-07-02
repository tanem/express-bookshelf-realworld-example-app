'use strict';

const errorCatcher = require('async-error-catcher').default;

module.exports = errorCatcher(async (req, res, next) => {
  const {
    app: {
      locals: {
        services: {users},
      },
    },
    params: {username} = {},
  } = req;
  const {
    locals: {trx},
  } = res;

  const user = await users.fetch({username}, {trx});
  /* eslint-disable-next-line require-atomic-updates */
  res.locals.user = user;

  next();
});
