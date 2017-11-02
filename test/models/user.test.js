// @flow

import faker from 'faker';
import User from '../../src/models/user';

describe('user model', () => {
  test('bio should be a string', async () => {
    expect.assertions(1);
    try {
      await new User({
        email: faker.internet.email(),
        username: faker.internet.userName(),
        bio: 1,
      }).save();
    } catch (e) {
      expect(e.toJSON()).toEqual({bio: ['The bio must be type "string"']});
    }
  });
});
