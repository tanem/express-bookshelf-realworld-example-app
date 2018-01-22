'use strict';

const passport = require('passport');
const AnonymousStrategy = require('passport-anonymous').Strategy;

module.exports = () => {
  passport.use(new AnonymousStrategy());
};
