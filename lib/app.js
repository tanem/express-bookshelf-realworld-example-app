'use strict';

const path = require('path');
const express = require('express');
const requireDirectory = require('require-directory');

const app = express();

requireDirectory(module, path.join(__dirname, './initializers'), {
  visit: (fn) => fn(app),
});

module.exports = app;
