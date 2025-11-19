const Redis = require("ioredis");
const { buildEvent } = require("./eventsHelper.js");

const eventCnn = new Redis({
  host: "event-bus",
  port: 6379,
});

async function publishEvent(channel, data, source) {
    const event = buildEvent({ event: channel, source, data });
    await eventCnn.publish(channel, JSON.stringify(event));
}

module.exports = { publishEvent };