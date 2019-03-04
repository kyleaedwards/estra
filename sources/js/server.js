/**
 * Imports
 */
const dgram = require('dgram');
const estra = require('./estra');

/**
 * Constants
 */
const PORT = 49160;
const server = dgram.createSocket('udp4');

/**
 * Server Event Handlers
 */
server.on('error', (err) => {
  console.error(err);
  server.close();
  estra.close();
});

server.on('message', (msg) => {
  estra.trigger(msg.toString('utf-8'));
});

server.on('listening', () => {
  estra.init();
});

server.bind(PORT);
