#!/bin/bash

set -e

if [ "$CI" = true ]; then
  npx jest -i --coverage
  cat ./_coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
else
  npx jest -i "$@"
fi