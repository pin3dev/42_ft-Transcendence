// const { twoFA_schema } = require("../schemas/user_schemas");
// const speakeasy = require("speakeasy");

// module.exports = async function (fastify) {
//   fastify.post("/auth/2fa", {
//     schema: twoFA_schema,
//   }, async (request, reply) => {
//     const { user_id, token } = request.body;

//     const user = await fastify.userRepo.findById(user_id);

//     if (!user || !user.twoFASecret) {
//       return reply.code(401).send({ error: "2FA não configurado" });
//     }

//     const valid = speakeasy.totp.verify({
//       secret: user.twoFASecret,
//       encoding: "base32",
//       token
//     });

//     if (!valid) {
//       return reply.code(401).send({ error: "Código inválido" });
//     }

//     if(!user.first2FALoginDone) {
//       await fastify.userRepo.markFirst2FALoginDone(user.id);
//     }

//     const jwtToken = await fastify.jwt.sign({
//       user_id: user.id,
//       email: user.email
//     }, {
//       expiresIn: "1h" 
//     });

//     return reply.code(200).send({
//       user_id: user.id,
//       jwt: jwtToken,    
//       message: "2FA verificado com sucesso"
//     });
//   });
// };
