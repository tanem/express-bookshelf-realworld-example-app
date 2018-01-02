#!/bin/bash

set -e

if [ "$NODE_ENV" = "production" ]; then
  node bin/www.js
else
  nodemon bin/www.js
fi  
