// @flow

import ExtendableError from 'es6-error';

export default class NotFoundError extends ExtendableError {
  status = 404;
}
