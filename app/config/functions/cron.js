'use strict';
const WebSocketClient = require('websocket').client;

const client = new WebSocketClient();
client.on('connectFailed', function(error) {
  console.log('Connect Error: ' + error.toString());
});
client.on('connect', function(connection) {
  console.log('WebSocket Client Connected');
  connection.on('error', function(error) {
    console.log("Connection Error: " + error.toString());
  });
  connection.on('close', function() {
    console.log('Connection Closed');
  });
  connection.on('message', function(message) {
    if (message.type === 'utf8') {
      console.log("Received: '" + message.utf8Data + "'");
    }
  });

  function startSync() {
    if (connection.connected) {
      connection.sendUTF('{"type": "1C_SYNC_PRODUCTS"}');
    }
  }
  startSync();
});

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/developer-docs/latest/concepts/configurations.html#cron-tasks
 */

module.exports = {
  '0 2 * * *': () => {
    client.connect(process.env.WS_SYNC_URL)
  },
};
