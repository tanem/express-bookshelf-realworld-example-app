'use strict';

const errorCatcher = require('async-error-catcher').default;

module.exports = errorCatcher(async (req, res, next) => {
  const {
    app: {
      locals: {
        services: {mappings},
      },
    },
    params: {slug} = {},
  } = req;
  const {
    locals: {trx},
  } = res;

  const mapping = await mappings.fetch({slug}, {trx});
  /* eslint-disable-next-line require-atomic-updates */
  res.locals.mapping = mapping;

  next();
});
