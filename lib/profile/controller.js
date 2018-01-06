'use strict';

const Boom = require('boom');
const errorCatcher = require('async-error-catcher').default;
const {Model: User} = require('../user');

exports.handleUsername = errorCatcher(async (req, res, next, username = '') => {
  const user = await new User({username}).fetch();
  if (!user) throw Boom.notFound();
  req.profile = user;
  next();
});

exports.get = errorCatcher(async (req, res) => {
  // We want to pass along the currently logged in user, if there is one.
  if (req.payload) {
    const user = await new User({id: req.payload.id}).fetch();
    if (user) {
      return res.json({
        profile: req.profile.toProfileJSONFor(user),
      });
    }
  }

  res.json({profile: req.profile.toProfileJSONFor(false)});
});
