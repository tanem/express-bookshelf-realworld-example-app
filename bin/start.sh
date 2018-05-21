#!/bin/bash

set -e

if [ "$NODE_ENV" = "production" ]; then
  node lib/server.js
else
  $(yarn bin)/knex --knexfile config/knexfile.js migrate:latest
  $(yarn bin)/nodemon lib/server.js | $(yarn bin)/pino-pretty -c -t
fi  
