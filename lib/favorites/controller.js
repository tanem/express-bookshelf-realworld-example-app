'use strict';

const errorCatcher = require('async-error-catcher').default;

exports.favorite = errorCatcher(async (req, res) => {
  const {user} = req;
  const {
    app: {
      locals: {
        services: {mappings, favorites},
      },
    },
    locals: {mapping, trx} = {},
  } = res;

  await favorites.create({user: user.id, mapping: mapping.id}, {trx});

  res.json({mapping: await mappings.toJSON(mapping, user, {trx})});
});

exports.unfavorite = errorCatcher(async (req, res) => {
  const {user} = req;
  const {
    app: {
      locals: {
        services: {mappings, favorites},
      },
    },
    locals: {mapping, trx} = {},
  } = res;

  const favorite = await favorites.fetch(
    {user: user.id, mapping: mapping.id},
    {trx},
  );
  await favorites.del(favorite, {trx});

  res.json({mapping: await mappings.toJSON(mapping, user, {trx})});
});
