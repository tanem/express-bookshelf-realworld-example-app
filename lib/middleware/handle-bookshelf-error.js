'use strict';

const Boom = require('boom');

// TODO: Handle specific model errors here for more detailed responses?
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
