'use strict';

const Boom = require('@hapi/boom');
const LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');

module.exports = (app) => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: 'user[email]',
        passwordField: 'user[password]',
      },
      async (email, password, done) => {
        let user;
        try {
          user = await app.locals.services.users.fetch({email});
          if (!(await user.isValidPassword(password, user))) {
            return done(Boom.badData('', {password: ['is invalid']}));
          }
        } catch (error) {
          if (error instanceof app.locals.bookshelf.NotFoundError) {
            return done(Boom.badData('', {email: ['is invalid']}));
          }
          return done(Boom.unauthorized());
        }
        return done(null, user);
      },
    ),
  );
};
