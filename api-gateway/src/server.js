require("dotenv").config();
const Fastify = require("fastify");
//const corsPlugin = require("./plugins/cors");
const jwt = require("@fastify/jwt");
const fs = require("fs");
const path = require("path");
const createServiceProxy = require("./proxy/serviceProxy");
const publicKey = fs.readFileSync("/app/keys/public.key");
const { getCache } = require("../pckg/redis/modules.js"); 

async function buildServer() {
  const app = Fastify();

  //await app.register(corsPlugin);

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
      const isDeleted = await getCache(`delUser:${request.user.userId}`);

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

  // app.register(createServiceProxy({
  //   prefix: "/teste",
  //   target: "http://auth-service:4000",
  //   onRequest: async (request, reply) => {
  //     await app.authenticate(request, reply);
  //     request.headers['x-user-id'] = request.user.userId;
  //     request.headers['x-user-email'] = request.user.email;
  //   }
  // }));

  app.register(createServiceProxy({
    prefix: "/user",
    target: "http://user-mgmt:5000",
    onRequest: async (request, reply) => {
      await app.authenticate(request, reply);
      request.headers['x-user-id'] = request.user.userId;
      request.headers['x-user-email'] = request.user.email; //ver se precisa manter isso já que não ta sendo usado
    }
  }));
  
  await app.ready();
  //console.log("📦 Rotas disponíveis:");
  //console.log(app.printRoutes());

  await app.listen({ port: 3000, host: "0.0.0.0" });
  //console.log("🚀 API Gateway rodando na porta 3000");
}

buildServer().catch(err => {
  //console.error("Erro ao iniciar o servidor:", err);
  process.exit(1);
});

