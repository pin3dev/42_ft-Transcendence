const Fastify = require("fastify");

mRepo = require("./infrastructure/repositories/match_repository.js");
rRepo = require("./infrastructure/repositories/ranking_repository.js");
tRepo = require("./infrastructure/repositories/tournament_repository.js");

const { matchFinished_listener } = require("./events/matchFinished_listener");
const { tournamentCreated_listener } = require("./events/tournamentCreated_listener");

const ranking_routes = require("./api/routes/ranking_routes");


const fastify = Fastify({ 
    logger: true,
  });
  
  fastify.decorate("mRepo", mRepo);
  fastify.decorate("rRepo", rRepo);
  fastify.decorate("tRepo", tRepo);

  fastify.register(require("@fastify/cookie"));
  fastify.register(ranking_routes);

  fastify.listen({ port: 8000, host: "0.0.0.0" }, (err) => {
    if (err) {
      fastify.log.error(err);
      process.exit(1);
    }
  });

  matchFinished_listener();
  tournamentCreated_listener();