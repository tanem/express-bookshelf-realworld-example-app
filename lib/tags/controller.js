'use strict';

const errorCatcher = require('async-error-catcher').default;

exports.index = errorCatcher(async (req, res) => {
  const {
    app: {
      locals: {
        services: {tags},
      },
    },
  } = res;

  const allTags = await tags.index();

  res.json({tags: allTags.pluck('name')});
});
