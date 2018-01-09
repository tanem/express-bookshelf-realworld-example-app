'use strict';

const errorCatcher = require('async-error-catcher').default;
const Tag = require('./model');

exports.index = errorCatcher(async (req, res) => {
  const tags = await Tag.fetchAll();
  res.json({tags: tags.pluck('name')});
});
