const getFriends = require("../../application/getFriends");

async function getFriends_controller(request, reply) {
  const userId = request.headers["x-user-id"];

  try {
    const friends = await getFriends(userId);
    reply.code(200).send({ friends });
  } catch (err) {
    reply.code(500).send({ error: "Erro ao listar amizades." });
  }
}

module.exports = { getFriends_controller };
