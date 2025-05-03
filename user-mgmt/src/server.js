// const Fastify = require("fastify");
// const profileRoutes = require("./api/routes/profileRoutes");

// const fastify = Fastify({ logger: true });

// fastify.register(profileRoutes);

// fastify.listen({ port: 5000 }, err => {
//   if (err) {
//     fastify.log.error(err);
//     process.exit(1);
//   }
// });





// const { handleUserRegistered } = require("./events/handler");

// handleUserRegistered();
// console.log("✅ user-mgmt service escutando user.registered via Redis...");





const { handleUserRegistered } = require("./events/handler");
const Fastify = require("fastify");
const profileRoutes = require("./api/routes/profileRoutes");

const fastify = Fastify({ logger: true });

fastify.register(profileRoutes);

fastify.listen({ port: 5000, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

handleUserRegistered();
