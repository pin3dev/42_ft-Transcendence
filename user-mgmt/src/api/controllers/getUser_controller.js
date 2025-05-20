const getUserProfile = require("../../application/getUserProfile");

async function getUser_controller(request, reply) {
  const user_id = request.headers["x-user-id"];
  console.log(request.headers) 
  if (!user_id) {
    return reply.code(401).send({ error: "Unauthorized: missing user ID" });
  }

  console.log("Resultado da busca:", user_id);

  try {
    const profile = await getUserProfile(user_id);
    return reply.send(profile);
  } catch (err) {
    const status = err.statusCode || 500;
    return reply.code(status).send({ error: err.message });
  }
}

module.exports = { getUser_controller };
