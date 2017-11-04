// @flow

import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';
import User from '../models/user';

passport.use(
  new LocalStrategy(
    {
      usernameField: 'user[email]',
      passwordField: 'user[password]',
    },
    async (email, password, done) => {
      let user;
      try {
        user = await new User({email}).fetch();
        if (!user || !user.validPassword(password)) {
          return done(null, false, {
            errors: {'email or password': 'is invalid'},
          });
        }
      } catch (error) {
        return done(error);
      }
      return done(null, user);
    },
  ),
);
