const getUserProfile = require("../../application/getUserProfile");

async function getUser_controller(request, reply) {
  const user_id = request.headers["x-user-id"];

  if (!user_id) {
    return reply.code(401).send({ error: "Unauthorized: missing user ID" });
  }

  try {
    const profile = await getUserProfile(user_id);
    return reply.send(profile);
  } catch (err) {
    // console.error("Error in getUser_controller:", err);
    const status = err.statusCode || 500;
    return reply.code(status).send({ error: err.message });
  }
}

module.exports = { getUser_controller };
