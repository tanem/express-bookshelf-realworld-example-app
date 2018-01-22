'use strict';

const Checkit = require('checkit');

module.exports = app => {
  app.locals.bookshelf.Model = app.locals.bookshelf.Model.extend({
    hasTimestamps: true,

    // TODO: Explain why this is unsafe.
    unsafeValidateUnique(fields, message = 'has already been taken') {
      return async (val, context) => {
        const query = app.locals.bookshelf.knex(this.tableName);

        if (context && context.transacting) {
          query.transacting(context.transacting);
        }

        const conditions = fields.reduce((obj, field) => {
          obj[field] = this.attributes[field];
          return obj;
        }, {});

        let resp;
        if (this.isNew()) {
          resp = await query.where(conditions);
        } else {
          resp = await query.where(conditions).where('id', '<>', this.id);
        }

        if (resp.length > 0) {
          throw new Checkit.ValidationError(message);
        }
      };
    },
  });
};
