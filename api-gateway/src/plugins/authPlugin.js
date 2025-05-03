const jwt = require("@fastify/jwt");
const fs = require("fs");
const path = require("path");

async function authPlugin(fastify) {
  const publicKey = fs.readFileSync("/app/keys/public.key");
  await fastify.register(jwt, {
    secret: async () => publicKey,  
    verify: { algorithms: ["RS256"] },
    sign: false                     
  });

}
module.exports = authPlugin;
