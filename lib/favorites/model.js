'use strict';

const Checkit = require('checkit');

module.exports = (bookshelf) =>
  bookshelf.model('Favorite', {
    tableName: 'favorites',

    getValidators() {
      return {
        mapping: [
          'required',
          'number',
          this.unsafeValidateUnique(
            ['user', 'mapping'],
            'has already been favorited',
          ),
        ],
        user: ['required', 'number'],
      };
    },

    mapping() {
      return this.belongsTo('Mapping', 'mapping');
    },

    user() {
      return this.belongsTo('User', 'user');
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
