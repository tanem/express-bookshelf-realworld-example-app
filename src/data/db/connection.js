// @flow

import knex from 'knex';
import config from '../../config';

export default knex(config.get('db'));
