#!/bin/bash

set -e

if [ "$CI" = true ]; then
  jest --coverage
  cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
else
  jest "$@"
fi