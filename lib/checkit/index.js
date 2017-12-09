const Checkit = require('checkit');
const {isUndefined} = require('lodash');
const knex = require('../knex');

// TODO: Explain why it's unsafe.
Checkit.Validator.prototype.unsafeUnique = async function(
  val,
  table,
  column,
  context,
) {
  const query = knex(table);

  if (context && context.transacting) {
    query.transacting(context.transacting);
  }

  const resp = await query.where({
    [column]: val,
    ...(isUndefined(this._target.id) ? {} : {id: this._target.id}),
  });

  if (resp.length > 0) {
    throw new Checkit.ValidationError(
      `The ${table}.${column} field is already in use`,
    );
  }
};

module.exports = Checkit;
