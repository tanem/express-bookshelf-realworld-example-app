const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const {Model: User} = require('../user');

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
        if (!user || !await user.isValidPassword(password, user)) {
          return done(null, false, {'email or password': ['is invalid']});
        }
      } catch (error) {
        return done(error);
      }
      return done(null, user);
    },
  ),
);
