#!/bin/bash

set -e

if [ "$NODE_ENV" = "production" ]; then
  node lib/server.js
else
  npx knex --knexfile config/knexfile.js migrate:latest
  npx nodemon lib/server.js | npx pino-pretty -c -t
fi  
