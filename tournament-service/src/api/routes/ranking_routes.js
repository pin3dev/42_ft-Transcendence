const { getTopRanking_controller } = require("../controllers/getTopRanking_controller");
const { getUserStats_controller } = require("../controllers/getUserStats_controller");
const { getTopRanking_schema, getUserStats_schema } = require("../schemas/ranking_schemas");

module.exports = async function (fastify) {
  fastify.get("/tournament/ranking/top", {
    schema: getTopRanking_schema,
    handler: getTopRanking_controller,
  });

  fastify.get("/tournament/ranking/me", {
    schema: getUserStats_schema,
    handler: getUserStats_controller,
  });
};