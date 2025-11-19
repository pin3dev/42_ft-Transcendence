const Redis = require("ioredis");

const cacheCnn = new Redis({
  host: "event-bus",
  port: 6379,
});

async function deleteCache(key) {
    await cacheCnn.del(key);
}

module.exports = { deleteCache };