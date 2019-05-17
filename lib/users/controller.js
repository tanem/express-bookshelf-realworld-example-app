'use strict';

const ExtractJwt = require('passport-jwt').ExtractJwt;
const errorCatcher = require('async-error-catcher').default;

exports.create = errorCatcher(async (req, res) => {
  const {body: {user: {email, password, username} = {}} = {}} = req;
  const {
    app: {
      locals: {
        services: {users},
      },
    },
    locals: {trx},
  } = res;

  const user = await users.create(
    {
      bio: '',
      email,
      image: '',
      username,
      password,
    },
    {trx},
  );

  res.status(201).json({user: users.getAuthJSON(user)});
});

exports.login = (req, res) => {
  const {user} = req;
  const {
    app: {
      locals: {
        services: {users},
      },
    },
  } = res;

  res.json({user: users.getAuthJSON(user)});
};

exports.get = errorCatcher(async (req, res) => {
  const {user} = req;
  const {
    app: {
      locals: {
        services: {users},
      },
    },
  } = res;

  const token = ExtractJwt.fromAuthHeaderWithScheme('Token')(req);

  res.json({
    user: users.getAuthJSON(user, token),
  });
});

exports.update = errorCatcher(async (req, res) => {
  const {body: {user: payload} = {}, user} = req;
  const {
    app: {
      locals: {
        services: {users},
      },
    },
    locals: {trx},
  } = res;

  const token = ExtractJwt.fromAuthHeaderWithScheme('Token')(req);
  const updatedUser = await users.update(user, payload, {trx});

  res.json({
    user: users.getAuthJSON(updatedUser, token),
  });
});
