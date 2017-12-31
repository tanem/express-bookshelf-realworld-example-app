'use strict';

const jwt = require('jsonwebtoken');
const {isNumber} = require('lodash/fp');
const moment = require('moment');
const config = require('../config');

expect.extend({
  toBeISO8601(received) {
    const pass = moment(received, moment.ISO_8601).isValid();
    if (pass) {
      return {
        message: () => `expected ${received} not to be an ISO 8601 string`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be an ISO 8601 string`,
        pass: false,
      };
    }
  },
  toBeBefore(received, argument) {
    const pass = moment(received).isBefore(moment(argument));
    if (pass) {
      return {
        message: () => `expected ${received} not to be before ${argument}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be before ${argument}`,
        pass: false,
      };
    }
  },
  toBeBetween(received, {a, b}) {
    const pass = moment(received).isBetween(moment(a), moment(b));
    if (pass) {
      return {
        message: () => `expected ${received} not to be between ${a} and ${b}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be between ${a} and ${b}`,
        pass: false,
      };
    }
  },
  toBeAValidJWT(received, {username}) {
    const decoded = jwt.verify(received, config.get('secret'));
    const pass =
      isNumber(decoded.id) &&
      decoded.username === username &&
      (decoded.exp - decoded.iat) / 60 / 60 / 24 === 60;
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid JWT`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid JWT`,
        pass: false,
      };
    }
  },
});
