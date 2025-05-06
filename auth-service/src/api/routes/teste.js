module.exports = async function (fastify) {
  fastify.get("/teste/teste", async (request, reply) => {
    const userId = request.headers["x-user-id"];
    const email = request.headers["x-user-email"];
    return {
      message: "Token aceito",
      user: {
        userId,
        email
      } 
    };
  });
};