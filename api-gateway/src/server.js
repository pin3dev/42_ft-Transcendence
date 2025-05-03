require("dotenv").config();
const Fastify = require("fastify");
const corsPlugin = require("./plugins/cors");
const jwt = require("@fastify/jwt");
const fs = require("fs");
const path = require("path");
//const authPlugin = require("./plugins/authPlugin"); // JWT
const createServiceProxy = require("./proxy/serviceProxy");

async function buildServer() {
  const app = Fastify();

  await app.register(corsPlugin);

  //await app.register(authPlugin); // ✅ Registra antes de usar app.authenticate

  const publicKey = fs.readFileSync("/app/keys/public.key");

  await app.register(jwt, {
    secret: async () => publicKey,  
    verify: { algorithms: ["RS256"] },
    sign: false                     
  });

  app.decorate("authenticate", async function (request, reply) {
    console.log("JWT3 MIDDLEWARE EXECUTADO", request.headers.authorization);
    try {
      await request.jwtVerify(); 
      console.log("request user:", request.user)
    } catch (err) {
      console.log("JWT FALHOU:", err.name, err.message);
      reply.code(401).send({ error: "Token inválido ou ausente" });
    }
  });

  console.log("TEM AUTHENTICATE?", typeof app.authenticate);

  app.register(createServiceProxy({
    prefix: "/auth/public",
    target: "http://auth-service:4000"
  }));

  // 🔐 Proxy protegido com JWT
  app.register(createServiceProxy({
    prefix: "/auth/private",
    target: "http://auth-service:4000",
    onRequest: async (request, reply) => {
      await app.authenticate(request, reply);
      request.headers['x-user-id'] = request.user.userId;
      request.headers['x-user-email'] = request.user.email;
    }
  }));

  // ✅ Rota de saúde pública para CI/CD

  
  await app.ready();
  console.log("📦 Rotas disponíveis:");
  console.log(app.printRoutes());

  await app.listen({ port: 3000, host: "0.0.0.0" });
  console.log("🚀 API Gateway rodando na porta 3000");
}

buildServer().catch(err => {
  console.error("Erro ao iniciar o servidor:", err);
  process.exit(1);
});

