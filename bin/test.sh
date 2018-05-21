#!/bin/bash

set -e

if [ "$CI" = true ]; then
  $(yarn bin)/jest -i --coverage
  cat ./_coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js
else
  $(yarn bin)/jest -i "$@"
fi