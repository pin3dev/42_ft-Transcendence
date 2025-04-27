// const fetch = require("node-fetch");

// module.exports = async function (fastify) {
//   fastify.post("/auth/register", async (request, reply) => {
//     console.log("📥 [GATEWAY] Requisição recebida no /auth/register");
//     console.log("🔎 Corpo recebido:", request.body);

//     try {
//       const res = await fetch("http://auth-service:4000/register", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(request.body),
//         timeout: 5000
//       });

//       const data = await res.json();

//       console.log("✅ [GATEWAY] Resposta do auth-service:", data);

//       return reply.code(res.status).send(data);

//     } catch (err) {
//       console.error("❌ [GATEWAY] Erro ao chamar auth-service:", err.name, err.message);

//       return reply.code(500).send({
//         error: "Erro interno no gateway",
//         detalhe: err.message
//       });
//     }
//   });
// };
