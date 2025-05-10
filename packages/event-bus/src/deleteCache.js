const Redis = require("ioredis");

const redisClient = new Redis({
  host: "event-bus",
  port: 6379
});

async function deleteCache(key) {
  await redisClient.del(key);
}

module.exports = { deleteCache };
