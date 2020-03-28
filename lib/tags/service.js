'use strict';

module.exports = (app) => ({
  async create(attributes, {trx} = {}) {
    const tag = await app.locals.models.Tag.forge(attributes).save(null, {
      method: 'insert',
      require: true,
      transacting: trx,
    });
    return tag;
  },

  async del(tag, {trx} = {}) {
    const deletedTag = await tag.destroy({transacting: trx, require: true});
    return deletedTag;
  },

  async fetch(attributes, {trx} = {}) {
    const tag = await app.locals.models.Tag.forge(attributes).fetch({
      require: true,
      transacting: trx,
    });
    return tag;
  },

  async index({trx} = {}) {
    const tags = await app.locals.models.Tag.fetchAll({transacting: trx});
    return tags;
  },
});
