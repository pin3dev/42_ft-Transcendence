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
const setupMetrics = require("../pckg/prometheus/metrics.js");


const JWTpublicKey = Buffer.from(process.env.JWT_PUBLIC_KEY_BASE64, 'base64').toString('utf-8');
const SSLkey = Buffer.from(process.env.SSL_KEY_BASE64, 'base64').toString('utf-8');
const SSLcert = Buffer.from(process.env.SSL_CERT_BASE64, 'base64').toString('utf-8');
const PORT = process.env.PORT;
// const PROTOCOLSSL = "https";
const PROTOCOL = "http";
const AUTH_SERVICE_URL = `${PROTOCOL}://auth-service:${process.env.PORT_AUTH_SERVICE}`;
const USER_MGMT_URL = `${PROTOCOL}://user-mgmt:${process.env.PORT_USER_MGMT}`;
const TOURNAMENT_SERVICE_URL = `${PROTOCOL}://tournament-service:${process.env.PORT_TOURNAMENT_SERVICE}`;

async function buildServer() {
  const app = Fastify({
    https: {
      key: SSLkey,
      cert: SSLcert,
    }
  });
  //console.logog("🚀 Iniciando API Gateway...");

  setupMetrics(app, "api-gateway");

  // Plugins essenciais
  await app.register(corsPlugin);
  await app.register(fastifyCookie);

  // Hook: insere o token do cookie como Authorization
  
  await app.register(fastifyStatic, {
    root: path.join(__dirname, '../frontend'),
    prefix: '/',
    index: 'index.html'
  });
  
  // Servir arquivos estáticos (avatares)
  await app.register(fastifyStatic, {
    root: path.join(__dirname, '../static/avatars'),
    prefix: '/static/avatars/', // Servirá via http://localhost:1025/static/avatars/...
    decorateReply: false // <- ESSENCIAL
  });

  
  
  app.setNotFoundHandler((req, reply) => {
    reply.sendFile('index.html'); // fallback para SPA simples
  });

  app.addHook("onRequest", async (request, reply) => {
    const jwtCookie = request.cookies?.jwt;
    if (jwtCookie && !request.headers.authorization) {
      request.headers.authorization = `Bearer ${jwtCookie}`;
    }
    //console.logog(`[API Gateway] Requisição recebida: ${request.method} ${request.url}`);
    //console.logog(`[API Gateway] Headers:`, request.headers);
  });

  // Headers CORS para todas as respostas
  app.addHook("onSend", async (request, reply, payload) => {
    reply.header("Access-Control-Allow-Origin", "https://localhost"); //request.headers.origin || ""
    reply.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    reply.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    reply.header("Access-Control-Allow-Credentials", "true");
    return payload;
  });

  // JWT
  await app.register(jwt, {
    secret: async () => JWTpublicKey,
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
    target: AUTH_SERVICE_URL,
    onRequest: async (request, reply) => {
      if (request.method === 'OPTIONS') return;
      
      // Apenas protege a rota /auth/get-token
      if (request.url === '/auth/get-token') {
        await app.authenticate(request, reply);
        request.headers['x-user-id'] = request.user.user_id;
        request.headers['x-user-email'] = request.user.email;
      }
    }
  }));

  // Proxy: Teste protegido
  app.register(createServiceProxy({
    prefix: "/teste",
    target: USER_MGMT_URL,
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
    target: USER_MGMT_URL,
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
      target: TOURNAMENT_SERVICE_URL,
      onRequest: async (request, reply) => {
        if (request.method === 'OPTIONS') return;
        await app.authenticate(request, reply);
        request.headers['x-user-id'] = request.user.user_id;
        request.headers['x-user-email'] = request.user.email;
      }
    }));


  await app.ready();
  await app.listen({ port: PORT, host: "0.0.0.0" });
}

buildServer().catch(err => {
  console.error("Erro ao iniciar o servidor:", err);
  process.exit(1);
});
