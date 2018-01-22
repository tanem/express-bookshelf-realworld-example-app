'use strict';

module.exports = ({locals: {models: {User}}}) => ({
  create: async (attributes, options = {}) =>
    await User.forge(attributes).save(null, {...options, require: true}),

  fetch: async (attributes, options = {}) =>
    await User.forge(attributes).fetch({...options, require: true}),
});
