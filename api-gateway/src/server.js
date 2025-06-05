require("dotenv").config();
const Fastify = require("fastify");
const fs = require("fs");
const path = require("path");

const corsPlugin = require("./plugins/cors");
const jwt = require("@fastify/jwt");
const fastifyCookie = require("@fastify/cookie");
const fastifyStatic = require("@fastify/static"); // Adicionado para servir arquivos estáticos
const createServiceProxy = require("./proxy/serviceProxy");
const { getCache } = require("../pckg/redis/modules.js");

const publicKey = fs.readFileSync("/app/keys/public.key"); // trocar
// const publicKey = Buffer.from(process.env.PUBLIC_KEY_BASE64, 'base64').toString('utf-8');


async function buildServer() {
  const app = Fastify();

  console.log("🚀 Iniciando API Gateway...");

  // Plugins essenciais
  await app.register(corsPlugin);
  await app.register(fastifyCookie);

  // Hook: insere o token do cookie como Authorization
  // Servir arquivos estáticos (avatares)
  await app.register(fastifyStatic, {
    root: path.join(__dirname, '../static/avatars'),
    prefix: '/static/avatars/', // Servirá via http://localhost:1025/static/avatars/...
  });

  app.addHook("onRequest", async (request, reply) => {
    const jwtCookie = request.cookies?.jwt;
    if (jwtCookie && !request.headers.authorization) {
      request.headers.authorization = `Bearer ${jwtCookie}`;
    }
    console.log(`[API Gateway] Requisição recebida: ${request.method} ${request.url}`);
    console.log(`[API Gateway] Headers:`, request.headers);
  });

  // Headers CORS para todas as respostas
  app.addHook("onSend", async (request, reply, payload) => {
    reply.header("Access-Control-Allow-Origin", "http://localhost:3000");
    reply.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    reply.header("Access-Control-Allow-Credentials", "true");
    return payload;
  });

  // JWT
  await app.register(jwt, {
    secret: async () => publicKey,
    verify: { algorithms: ["RS256"] },
    sign: false
  });

  // Middleware de autenticação
  app.decorate("authenticate", async function (request, reply) {
    try {
      await request.jwtVerify();

      const { user_id } = request.user;
      if (!user_id) {
        return reply.code(401).send({ error: "Token inválido: user_id ausente" });
      }

      const isDeleted = await getCache(`delUser:${user_id}`);
      if (isDeleted) {
        return reply.code(401).send({ error: "Usuário excluído" });
      }
    } catch (err) {
      reply.code(401).send(err);
    }
  });

  // Proxy: Auth
  app.register(createServiceProxy({
    prefix: "/auth",
    target: "http://auth-service:4000"
  }));

  // Proxy: Teste protegido
  app.register(createServiceProxy({
    prefix: "/teste",
    target: "http://user-mgmt:5000",
    onRequest: async (request, reply) => {
      if (request.method === 'OPTIONS') return;
      await app.authenticate(request, reply);
      request.headers['x-user-id'] = request.user.user_id;
      request.headers['x-user-email'] = request.user.email;
    }
  }));

  // Proxy: User
  app.register(createServiceProxy({
    prefix: "/user",
    target: "http://user-mgmt:5000",
    onRequest: async (request, reply) => {
      if (request.method === 'OPTIONS') return;
      await app.authenticate(request, reply);
      request.headers['x-user-id'] = request.user.user_id;
      request.headers['x-user-email'] = request.user.email;
    }
  }));

    // Proxy: Teste protegido
    app.register(createServiceProxy({
      prefix: "/tournament",
      target: "http://tournament-service:6000",
      onRequest: async (request, reply) => {
        if (request.method === 'OPTIONS') return;
        await app.authenticate(request, reply);
        request.headers['x-user-id'] = request.user.user_id;
        request.headers['x-user-email'] = request.user.email;
      }
    }));

  await app.ready();
  await app.listen({ port: 1025, host: "0.0.0.0" });
}

buildServer().catch(err => {
  console.error("Erro ao iniciar o servidor:", err);
  process.exit(1);
});
