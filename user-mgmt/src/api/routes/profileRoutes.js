// const profileRepo = require("../../infraestructure/db/profileRepository");

// async function profileRoutes(fastify, opts) {
//   fastify.get("/user/me", async (request, reply) => {
//     // Simula autenticação pegando userId do header (em prod, viria do token JWT)
//     const userId = request.headers["x-user-id"];
//     if (!userId) {
//       return reply.status(401).send({ error: "Unauthorized" });
//     }

//     const profile = await profileRepo.findById(userId);
//     if (!profile) {
//       return reply.status(404).send({ error: "Profile not found" });
//     }

//     return reply.send(profile);
//   });
// }

// module.exports = profileRoutes;

const profileRepo = require("../../infraestructure/db/profileRepository");

async function profileRoutes(fastify, opts) {
  fastify.get("/me", async (request, reply) => {
    const userId = request.headers["x-user-id"];
    if (!userId) {
      return reply.status(401).send({ error: "Unauthorized" });
    }

    const profile = await profileRepo.findById(userId);
    if (!profile) {
      return reply.status(404).send({ error: "Profile not found" });
    }

    return reply.send(profile);
  });
}


module.exports = profileRoutes;
