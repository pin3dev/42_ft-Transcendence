const Redis = require("ioredis");

const subscriber = new Redis({
  host: "event-bus",
  port: 6379
});

function subscribeToEvent(channel, callback) {
  subscriber.subscribe(channel);

  subscriber.on("message", (receivedChannel, message) => {
    if (receivedChannel === channel) {
      const event = JSON.parse(message);
      callback(event);
    }
  });
}

module.exports = { subscribeToEvent };
