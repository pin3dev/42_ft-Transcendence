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





// const profileRepo = require("../../infraestructure/db/profileRepository");

// async function profileRoutes(fastify, opts) {
//   fastify.get("/me", async (request, reply) => {
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




const getUserProfile = require("../../application/getUserProfile");
const deleteUserProfile = require("../../application/deleteUserProfile");
const updateUserProfile = require("../../application/updateUserProfile");

const { getUserMeResponse, gatewayHeaders } = require("../schemas/profileSchemas");

module.exports = async function (fastify) {
  fastify.get("/user/profile", {
    schema: {
      description: "Get the authenticated user's profile",
      headers: gatewayHeaders,
      response: getUserMeResponse
    }
  }, async (request, reply) => {
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
  });

  fastify.put('/user/profile', {
    schema: {
      headers: gatewayHeaders,
    },
    handler: async (request, reply) => {
      try {
        console.log('PUT body:', request.body);
        const userId = request.headers['x-user-id'];
        const result = await updateUserProfile(userId, request.body);
        reply.send(result);
      } catch (err) {
        reply.status(err.statusCode || 500).send({ error: err.message });
      }
    }
  });

  fastify.delete('/user/profile', {
    schema: {
      headers: gatewayHeaders,
    },
    handler: async (request, reply) => {
      try {
        const userId = request.headers['x-user-id'];
        await deleteUserProfile(userId);
        reply.status(204).send();
      } catch (err) {
        reply.status(err.statusCode || 500).send({ error: err.message });
      }
    }
  });
  
};
