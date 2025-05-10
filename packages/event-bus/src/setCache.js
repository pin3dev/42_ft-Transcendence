const Redis = require("ioredis");

const redisClient = new Redis({
  host: "event-bus",
  port: 6379
});

/**
 * Seta uma chave simples com valor string, número ou booleano.
 * Se quiser TTL, passe em segundos.
 */
async function setCache(key, value, ttl = null) {
  const serialized = value === true ? "true" : "false"; // garante tipo booleano convertido
  
  if (ttl) {
    await redisClient.set(key, serialized, "EX", ttl);
  } else {
    await redisClient.set(key, serialized);
  }
}

module.exports = { setCache };
