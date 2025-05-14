const updateUserProfile = require("../../application/updateUserProfile");

async function updateUser_controller(request, reply) {
  const userId = request.headers["x-user-id"];

  if (!userId) {
    return reply.status(401).send({ error: "Unauthorized: missing user ID" });
  }

  try {
    const result = await updateUserProfile(userId, request.body);
    return reply.send(result);
  } catch (err) {
    const status = err.statusCode || 500;
    return reply.status(status).send({ error: err.message });
  }
}

module.exports = {
  updateUser_controller,
};
