'use strict';

const errorCatcher = require('async-error-catcher').default;
const passport = require('passport');

module.exports = errorCatcher(async (req, res, next) => {
  passport.authenticate('local', {session: false}, (error, user) => {
    if (error) throw error;
    req.user = user;
    next();
  })(req, res, next);
});
