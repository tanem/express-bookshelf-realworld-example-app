#!/bin/bash

set -e

if [ "$CI" = true ]; then
  npm run check:format
  npm run lint
  npx jest -i --coverage
  bash <(curl -s https://codecov.io/bash)
else
  npx jest -i "$@"
fi