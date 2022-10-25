'use strict';

const Checkit = require('checkit');

module.exports = (bookshelf) =>
  bookshelf.model('Tag', {
    tableName: 'tags',

    getValidators() {
      return {
        name: [
          'required',
          'string',
          this.unsafeValidateUnique(['name'], 'is already defined'),
        ],
      };
    },

    mapping() {
      return this.belongsToMany('Mapping').through(
        'MappingTag',
        'tag',
        'mapping',
      );
    },

    initialize() {
      this.on('saving', this.handleSaving);
    },

    async handleSaving(model, attrs, options) {
      const checkit = new Checkit(this.getValidators(), {
        messages: {
          required: `can't be blank`,
        },
      });

      await checkit.run(this.attributes, options);
    },
  });
