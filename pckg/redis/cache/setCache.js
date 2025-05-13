const Redis = require("ioredis");

const cacheCnn = new Redis({
  host: "event-bus",
  port: 6379
});

/**
 * Seta uma chave simples com valor string, número ou booleano.
 * Se quiser TTL, passe em segundos.
 */
async function setCache(key, value, ttl = null) {
    const serialized = JSON.stringify(value);
    
    if (ttl) {
      await cacheCnn.set(key, serialized, "EX", ttl);
    } else {
      await cacheCnn.set(key, serialized);
    }
}

module.exports = { setCache };