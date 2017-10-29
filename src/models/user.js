// @flow

import conduitBookshelf from './base';

const User = conduitBookshelf.Model.extend({
  tableName: 'users',

  validate: {
    bio: ['string'],
    email: ['required', 'email', 'unique:users:email'],
    hash: ['string'],
    image: ['string'],
    salt: ['string'],
    username: ['required', 'string', 'unique:users:username'],
  },
});

export default User;
