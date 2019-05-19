'use strict';

const {addMatchers} = require('add-matchers');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const {isNumber} = require('lodash/fp');
const config = require('../config');

addMatchers.asymmetric({
  isISO8601(received) {
    this.toJSON = () => `isISO8601`;
    return moment(received, moment.ISO_8601).isValid();
  },
  isValidJWT({username}, received) {
    this.toJSON = () => `isValidJWT username=${username}`;
    const decoded = jwt.verify(received, config.get('secret'));
    return (
      isNumber(decoded.id) &&
      decoded.username === username &&
      (decoded.exp - decoded.iat) / 60 / 60 / 24 === 60
    );
  },
});
