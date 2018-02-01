#!/bin/bash

set -e

if [ "$CI" = true ]; then
  jest --coverage
  cat ./_coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
else
  jest "$@"
fi