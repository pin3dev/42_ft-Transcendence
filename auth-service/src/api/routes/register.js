// const { register_schema } = require("../schemas/user_schemas");
// const { registerUser } = require("../../application/registerUser");

// module.exports = async function (fastify) {
//   fastify.post("/auth/register", {
//     schema: register_schema,
//   }, async (request, reply) => {
//     const { email, password } = request.body;

//     try {
//       const result = await registerUser(email, password, {
//         userRepo: fastify.userRepo,
//         hasher: fastify.hasher
//       });

//       reply.code(201).send({
//         user_id: result.user_id,
//         message: "Usuário criado com sucesso",
//         qr_code: result.otpauthUrl 
//       });

//     } catch (err) {
//       reply.code(400).send({ error: err.message });
//     }
//   });
// };

