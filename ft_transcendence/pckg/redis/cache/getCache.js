const Redis = require("ioredis");

const cacheCnn = new Redis({
  host: "event-bus",
  port: 6379,
});

async function getCache(key) {
    return await cacheCnn.get(key);
}

module.exports = { getCache };