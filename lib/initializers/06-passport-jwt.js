'use strict';

const Boom = require('boom');
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;
const passport = require('passport');
const config = require('../../config');

module.exports = app => {
  passport.use(
    new JwtStrategy(
      {
        secretOrKey: config.get('secret'),
        jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme('Token'),
      },
      async ({id}, done) => {
        let user;
        try {
          user = await app.locals.services.users.fetch({id});
        } catch (error) {
          return done(Boom.unauthorized());
        }
        return done(null, user);
      },
    ),
  );
};
