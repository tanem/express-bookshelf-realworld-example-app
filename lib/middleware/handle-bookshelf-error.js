'use strict';

const Boom = require('@hapi/boom');

module.exports = (err, req, res, next) => {
  const {app: {locals: {bookshelf} = {}} = {}} = req;

  if (err instanceof bookshelf.NotFoundError) {
    return next(Boom.notFound());
  }

  if (
    err instanceof bookshelf.NoRowsUpdatedError ||
    err instanceof bookshelf.NoRowsDeletedError
  ) {
    return next(Boom.badData());
  }

  next(err);
};
