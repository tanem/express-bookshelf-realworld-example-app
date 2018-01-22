'use strict';

const errorCatcher = require('async-error-catcher').default;
const {Model: User} = require('../user');

exports.get = errorCatcher(async (req, res) => {
  // We want to pass along the currently logged in user, if there is one.
  if (req.payload) {
    const user = await new User({id: req.payload.id}).fetch({
      withRelated: ['following'],
    });
    if (user) {
      return res.json({
        profile: res.locals.user.toProfileJSONFor(user),
      });
    }
  }

  // TODO: Add username instead of `false`.
  res.json({profile: res.locals.user.toProfileJSONFor(false)});
});
