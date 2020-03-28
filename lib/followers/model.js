'use strict';

const Checkit = require('checkit');

module.exports = (bookshelf) =>
  bookshelf.model('Follower', {
    tableName: 'followers',

    getValidators() {
      return {
        follower: [
          'required',
          'number',
          this.unsafeValidateUnique(
            ['user', 'follower'],
            'is already following this user',
          ),
        ],
        user: ['required', 'number'],
      };
    },

    user() {
      return this.belongsTo('User', 'user');
    },

    follower() {
      return this.belongsTo('User', 'follower');
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
