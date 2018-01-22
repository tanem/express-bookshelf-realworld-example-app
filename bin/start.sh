#!/bin/bash

set -e

if [ "$NODE_ENV" = "production" ]; then
  node lib/server.js
else
  nodemon lib/server.js
fi  
