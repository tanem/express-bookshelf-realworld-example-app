'use strict';

const jwt = require('express-jwt');
const config = require('../../config');

const getTokenFromHeader = req => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Token'
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
};

exports.required = jwt({
  secret: config.get('secret'),
  requestProperty: 'payload',
  getToken: getTokenFromHeader,
});

exports.optional = jwt({
  secret: config.get('secret'),
  requestProperty: 'payload',
  credentialsRequired: false,
  getToken: getTokenFromHeader,
});
