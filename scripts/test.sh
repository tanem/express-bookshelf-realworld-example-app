#!/bin/bash

set -e

if [ "$CI" = true ]; then
  jest --coverage --coverageReporters=text-summary lcov
  cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
else
  jest "$@"
fi