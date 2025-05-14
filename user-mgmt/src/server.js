// File: src/server.js
// Description: This file sets up a Fastify server and registers the profile routes.

const { handleUserRegistered } = require("./events/profile_eventsHandler");
const Fastify = require("fastify");
const profileRoutes = require("./api/routes/profileRoutes");
const friendRoutes = require("./api/routes/friendRoutes");
const profileRepo = require("./infrastructure/db/profile_repository");
const friendRepo = require("./infrastructure/db/friends_repository");


const fastify = Fastify({ logger: true });

fastify.decorate("profileRepo", profileRepo);
fastify.decorate("friendRepo", friendRepo);
fastify.register(profileRoutes);
fastify.register(friendRoutes);

fastify.listen({ port: 5000, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

handleUserRegistered();
