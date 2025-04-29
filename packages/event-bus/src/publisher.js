const Redis = require("ioredis");
const { buildEvent } = require("./eventBuilder");

const publisher = new Redis({
  host: "event-bus",
  port: 6379
});

async function publishEvent(channel, data, source) {
  const event = buildEvent({ event: channel, source, data });
  await publisher.publish(channel, JSON.stringify(event));
}

module.exports = { publishEvent };
