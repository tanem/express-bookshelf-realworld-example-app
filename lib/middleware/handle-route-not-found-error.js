'use strict';

const Boom = require('@hapi/boom');

module.exports = (req, res, next) => {
  next(Boom.notFound());
};
