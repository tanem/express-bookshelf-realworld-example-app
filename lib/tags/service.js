'use strict';

module.exports = app => ({
  async create(attributes, options = {}) {
    const tag = await app.locals.models.Tag.forge(attributes).save(null, {
      ...options,
      method: 'insert',
      require: true,
    });
    return tag;
  },

  async del(tag, options = {}) {
    const deletedTag = await tag.destroy({...options, require: true});
    return deletedTag;
  },

  async fetch(attributes, options = {}) {
    const tag = await app.locals.models.Tag.forge(attributes).fetch({
      ...options,
      require: true,
    });
    return tag;
  },

  async index() {
    const tags = await app.locals.models.Tag.fetchAll();
    return tags;
  },
});
