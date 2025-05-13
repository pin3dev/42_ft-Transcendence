const getUserProfile = require("../../application/getUserProfile");

async function getUser_controller(request, reply) {
  const userId = request.headers["x-user-id"];
  if (!userId) {
    return reply.code(401).send({ error: "Unauthorized: missing user ID" });
  }

  try {
    const profile = await getUserProfile(userId);
    return reply.send(profile);
  } catch (err) {
    const status = err.statusCode || 500;
    return reply.code(status).send({ error: err.message });
  }
}

module.exports = { getUser_controller };
