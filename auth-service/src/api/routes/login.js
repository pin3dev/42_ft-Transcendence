// const { login_schema } = require("../schemas/user_schemas");
// const { loginUser } = require("../../application/loginUser");

// module.exports = async function (fastify) {
//   fastify.post("/auth/login", {
//     schema: login_schema,
//   }, async (request, reply) => {
//     const { email, password } = request.body;

//     try {
//       const result = await loginUser(email, password, {
//         userRepo: fastify.userRepo,
//         hasher: fastify.hasher
//       });

//       if (result.status === "2FA_REQUIRED") {
//         return reply.code(200).send({
//           user_id: result.user_id,
//           status: "2FA_REQUIRED",
//           message: "Autenticação de dois fatores necessária",
//           ...(result.otpauthUrl && { qr_code: result.qr_code})
//         });
//       }

//     } catch (err) {
//       reply.code(401).send({ error: err.message });
//     }
//   });
// };
