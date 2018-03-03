'use strict';

const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const config = require('../../config');

module.exports = () => {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: config.get('secret'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
      },
      ({id}, done) => {
        // The real user is fetched within the callback, but we need to pass
        // something truthy in the user slot here so that passport auth works
        // correctly (e.g. for the optional auth setup).
        done(null, {userId: id});
      },
    ),
  );
};
