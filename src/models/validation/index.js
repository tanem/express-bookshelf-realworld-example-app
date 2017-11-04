// @flow

import Checkit from 'checkit';
import {isUndefined} from 'lodash';
import {knex} from '../../data/db';

Checkit.Validator.prototype.unique = async function(
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
    throw new Error(`The ${table}.${column} field is already in use`);
  }
};

export default Checkit;
