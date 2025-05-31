const searchProfile = require("../../application/searchProfile");

async function searchProfile_controller(request, reply) {
  const { name } = request.query;

  try {
    const results = await searchProfile(name);
    return reply.code(200).send(results);
  } catch (err) {
    const status = err.statusCode || 500;
    return reply.code(status).send({ error: err.message });
  }
}

module.exports = { searchProfile_controller };
