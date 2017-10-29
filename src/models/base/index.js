// @flow

import bookshelf from 'bookshelf';
import Checkit from '../validation';
import {knex} from '../../data/db';

const conduitBookshelf = bookshelf(knex);

conduitBookshelf.Model = conduitBookshelf.Model.extend({
  hasTimestamps: true,

  initialize() {
    this.on('saving', this.validateSave);
  },

  validateSave(model, attrs, options) {
    if (this.validate) {
      return Checkit(this.validate).run(this.attributes, options);
    }
  },
});

export default conduitBookshelf;
