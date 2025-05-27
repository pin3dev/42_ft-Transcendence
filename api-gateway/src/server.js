// require("dotenv").config();
const Fastify = require("fastify");
const corsPlugin = require("./plugins/cors");
const jwt = require("@fastify/jwt");
const fs = require("fs");
const path = require("path");
const createServiceProxy = require("./proxy/serviceProxy");
const publicKey = fs.readFileSync("/app/keys/public.key");
const { getCache } = require("../pckg/redis/modules.js"); 

async function buildServer() {
  const app = Fastify();

  await app.register(corsPlugin);

  app.addHook("onRequest", async (request, reply) => {
    console.log(`[API Gateway] Requisição recebida: ${request.method} ${request.url}`);
    console.log(`[API Gateway] Headers:`, request.headers);
  });

  app.addHook("onSend", async (request, reply, payload) => {
    reply.header("Access-Control-Allow-Origin", "http://localhost:3000");
    reply.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    reply.header("Access-Control-Allow-Credentials", "true");
    return payload;
  });

  await app.register(jwt, {
    secret: async () => publicKey,  
    verify: { algorithms: ["RS256"] },
    sign: false                     
  });

  app.decorate("authenticate", async function (request, reply) {
    //console.log("JWT3 MIDDLEWARE EXECUTADO", request.headers.authorization);
    try {
      await request.jwtVerify(); 
      //console.log("request user:", request.user)
      
      // Ivany: aplicação de cache
      // const isDeleted = await getCache(`delUser:${request.user.userId}`);

      const { user_id } = request.user;
      if (!user_id) {
        return reply.code(401).send({ error: "Token inválido: user_id ausente" });
      }
      const isDeleted = await getCache(`delUser:${user_id}`);

      if (isDeleted) {
        const error = new Error("Usuário excluído");
        error.statusCode = 401;
        throw error;
      }

    } catch (err) {
      //console.log("JWT FALHOU:", err.name, err.message);
      reply.code(401).send(err);
    }
  });



  //console.log("TEM AUTHENTICATE?", typeof app.authenticate);

  app.register(createServiceProxy({
    prefix: "/auth",
    target: "http://auth-service:4000"
  }));

  app.register(createServiceProxy({
    prefix: "/teste", // Prefixo da rota protegida
    target: "http://user-mgmt:5000", // Serviço de destino
    onRequest: async (request, reply) => {
      // Autentica o token JWT
      await app.authenticate(request, reply);
  
      // Adiciona informações do usuário autenticado nos headers
      request.headers['x-user-id'] = request.user.user_id;
      request.headers['x-user-email'] = request.user.email;
    }
  }));

  app.register(createServiceProxy({
    prefix: "/user",
    target: "http://user-mgmt:5000",
    onRequest: async (request, reply) => {
      await app.authenticate(request, reply);
      request.headers['x-user-id'] = request.user.user_id;
      request.headers['x-user-email'] = request.user.email; //ver se precisa manter isso já que não ta sendo usado
    }
  }));
  
  await app.ready();
  //console.log("📦 Rotas disponíveis:");
  //console.log(app.printRoutes());

  await app.listen({ port: 1025, host: "0.0.0.0" });
  //console.log("🚀 API Gateway rodando na porta 1025");
}

buildServer().catch(err => {
  //console.error("Erro ao iniciar o servidor:", err);
  process.exit(1);
});

