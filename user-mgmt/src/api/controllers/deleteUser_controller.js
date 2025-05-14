const deleteUserProfile = require("../../application/deleteUserProfile");

async function deleteUser_controller(request, reply) {
  const userId = request.headers["x-user-id"];
  if (!userId) {
    return reply.status(401).send({ error: "Unauthorized: missing user ID" });
  }

  try {
    await deleteUserProfile(userId);
    return reply.status(204).send();
  } catch (err) {
    const status = err.statusCode || 500;
    return reply.status(status).send({ error: err.message });
  }
}

module.exports = {
    deleteUser_controller,
};
