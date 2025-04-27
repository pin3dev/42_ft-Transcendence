require("dotenv").config();
const Fastify = require("fastify");
const corsPlugin = require("./plugins/cors");
const createServiceProxy = require("./proxy/serviceProxy");

async function buildServer() {
  const app = Fastify({ logger: true });

  await app.register(corsPlugin);

  app.register(createServiceProxy({
    prefix: "/auth",
    target: "http://auth-service:4000"
  }));

  await app.ready();
  console.log("📦 Rotas disponíveis:");
  console.log(app.printRoutes());

  // ⬇️ ESSENCIAL: inicia o servidor
  await app.listen({ port: 3000, host: "0.0.0.0" });
  console.log("🚀 API Gateway rodando na porta 3000");
}

buildServer().catch(err => {
  console.error("Erro ao iniciar o servidor:", err);
  process.exit(1);
});
