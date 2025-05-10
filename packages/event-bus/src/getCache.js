const Redis = require("ioredis");

const redisClient = new Redis({
  host: "event-bus",
  port: 6379
});

async function getCache(key) {
  return await redisClient.get(key);
}


module.exports = { getCache };
