'use strict';

const Checkit = require('checkit');

module.exports = (app) => {
  app.locals.bookshelf.Model = app.locals.bookshelf.Model.extend({
    hasTimestamps: true,

    // The Ecto docs do a good example of explaining why this function is named
    // as `unsafe`: https://hexdocs.pm/ecto/Ecto.Changeset.html#unsafe_validate_unique/4.
    // In this app there are database unique constraints set up, and any errors
    // that occur relating to those constraints are handled via middleware.
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
