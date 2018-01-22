'use strict';

module.exports = ({locals: {models: {Tag}}}) => ({
  async index() {
    const tags = await Tag.fetchAll();
    return tags;
  },

  async create(attributes, options = {}) {
    const tag = await Tag.forge(attributes).save(null, {
      ...options,
      method: 'insert',
      require: true,
    });
    return tag;
  },
});
