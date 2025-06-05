const Fastify = require("fastify");

mRepo = require("./infrastructure/db/match_repository.js");
rRepo = require("./infrastructure/db/ranking_repository.js");
tRepo = require("./infrastructure/db/tournament_repository.js");

const { matchFinished_listener } = require("./events/matchFinished_listener");
const { tournamentCreated_listener } = require("./events/tournamentCreated_listener");

const ranking_routes = require("./api/routes/ranking_routes");


const fastify = Fastify({ 
    logger: true,
  });

  fastify.options('/*', (request, reply) => {
    reply
      .code(204)
      .header("Access-Control-Allow-Origin", "http://localhost:3000")
      .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
      .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
      .header("Access-Control-Allow-Credentials", "true")
      .send();
  });
  
  fastify.decorate("mRepo", mRepo);
  fastify.decorate("rRepo", rRepo);
  fastify.decorate("tRepo", tRepo);

  fastify.register(ranking_routes);

  fastify.listen({ port: 6000, host: "0.0.0.0" }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });

  matchFinished_listener();
  tournamentCreated_listener();