'use strict';

module.exports = app => ({
  async index() {
    const tags = await app.locals.models.Tag.fetchAll();
    return tags;
  },

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
});
