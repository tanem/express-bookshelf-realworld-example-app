#!/usr/bin/env node

// @flow

import Debug from 'debug';
import http from 'http';
import app from '../app';
import config from '../config';

const debug = Debug('conduit-node-server:server');

// Get port from environment and store in Express.
// TODO: This is weird. Should just default to 3000...
const port = config.get('port');
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let bind = '';

  if (typeof port === 'string') {
    bind = `Pipe ${port}`;
  }

  if (typeof port === 'number') {
    bind = `Port ${port}`;
  }

  // Handle specific listen errors with friendly messages.
  switch (error.code) {
    case 'EACCES':
      // eslint-disable-next-line no-console
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // eslint-disable-next-line no-console
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

// Event listener for HTTP server "listening" event.
function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug(`Listening on ${bind}`);
}
