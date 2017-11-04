// @flow

import jwt from 'express-jwt';
import config from '../config';

export const required = jwt({
  secret: config.get('secret'),
  requestProperty: 'payload',
  getToken: getTokenFromHeader,
});

export const optional = jwt({
  secret: config.get('secret'),
  requestProperty: 'payload',
  credentialsRequired: false,
  getToken: getTokenFromHeader,
});

function getTokenFromHeader(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Token'
  ) {
    return req.headers.authorization.split(' ')[1];
  }
  return null;
}
