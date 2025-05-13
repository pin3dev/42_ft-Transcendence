const Redis = require("ioredis");
// const { EventTypes } = require("./eventsHelper.js");

const eventCnn = new Redis({
  host: "event-bus",
  port: 6379
});

function subscribeToEvent(channel, callback) {
    eventCnn.subscribe(channel);

    eventCnn.on("message", (receivedChannel, message) => {
    if (receivedChannel === channel) {
      const event = JSON.parse(message);
      callback(event);
    }
  });
}

module.exports = { subscribeToEvent };