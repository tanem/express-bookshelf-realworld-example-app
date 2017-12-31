'use strict';

const Checkit = require('checkit');
const {isUndefined} = require('lodash/fp');
const knex = require('../knex');

// TODO: Explain why it's unsafe.
// TODO: Handle PostgreSQL errors (unique).
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

  let resp;
  if (isUndefined(this._target.id)) {
    resp = await query.where(column, '=', val);
  } else {
    resp = await query
      .where(column, '=', val)
      .where('id', '<>', this._target.id);
  }

  if (resp.length > 0) {
    throw new Checkit.ValidationError(
      `The ${table}.${column} field is already in use`,
    );
  }
};

module.exports = Checkit;
