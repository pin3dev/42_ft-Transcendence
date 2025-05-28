module.exports = async function (fastify) {
    fastify.get("/teste", async (request, reply) => {
      const userId = request.headers['x-user-id'];
      const email = request.headers['x-user-email'];
  
      return {
        message: "Acesso autorizado!",
        user: {
          userId,
          email,
        },
      };
    });
  };