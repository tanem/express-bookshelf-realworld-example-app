'use strict';

const errorCatcher = require('async-error-catcher').default;

module.exports = errorCatcher(async (req, res, next) => {
  const {app: {locals: {services: {users}}}, params: {username} = {}} = req;

  const user = await users.fetch({username});
  res.locals.user = user;

  next();
});
