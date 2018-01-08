'use strict';

const Checkit = require('checkit');
const bookshelf = require('../bookshelf');

// TODO: Can we get rid of this direct import via:https://stackoverflow.com/questions/30887784/set-timestamps-on-a-pivot-model-with-bookshelf-js?
// require('../user/model');

const Model = bookshelf.Model.extend({
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

module.exports = bookshelf.model('Follow', Model);
