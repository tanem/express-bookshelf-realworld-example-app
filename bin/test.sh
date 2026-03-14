#!/bin/bash

set -e

if [ "$CI" = true ]; then
  npx jest -i --coverage
else
  npx jest -i "$@"
fi