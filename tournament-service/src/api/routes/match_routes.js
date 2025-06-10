const { getMatchHistory_controller } = require("../controllers/getMatchHistory_controller");
const { getMatchHistory_schema } = require("../schemas/match_schemas");

module.exports = async function (fastify) {
  fastify.get("/tournament/matches/history/:userId", {
    schema: getMatchHistory_schema,
    handler: getMatchHistory_controller,
  });
};