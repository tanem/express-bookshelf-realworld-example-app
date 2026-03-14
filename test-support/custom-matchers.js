'use strict';

const {addMatchers} = require('add-matchers');
const jwt = require('jsonwebtoken');
const config = require('../config');

addMatchers.asymmetric({
  isISO8601(received) {
    this.toJSON = () => `isISO8601`;
    return !isNaN(new Date(received).getTime());
  },
  isValidJWT({username}, received) {
    this.toJSON = () => `isValidJWT username=${username}`;
    const decoded = jwt.verify(received, config.get('secret'));
    return (
      typeof decoded.id === 'number' &&
      decoded.username === username &&
      (decoded.exp - decoded.iat) / 60 / 60 / 24 === 60
    );
  },
});
