const Fastify = require("fastify");
const path = require("path");
const fs = require("fs");
const fastifyJwt = require("@fastify/jwt");
const fastifyCookie = require('@fastify/cookie');

const auth_routes = require("./api/routes/auth_routes");

const userRepo = require("./infrastructure/db/user_repository");
const hasher = require("./infrastructure/crypto/bcryptHasher");
const { userDeleted_listener } = require("./events/userDeleted_listener");


const JWTprivateKey = Buffer.from(process.env.JWT_PRIVATE_KEY_BASE64, 'base64').toString('utf-8'); // key nova
const JWTpublicKey = Buffer.from(process.env.JWT_PUBLIC_KEY_BASE64, 'base64').toString('utf-8'); // key nova


async function start() {
  const app = Fastify({ logger: true });

  app.register(fastifyJwt, {
    secret: {
      private: JWTprivateKey,
      public: JWTpublicKey
    },
    sign: { algorithm: 'RS256', key: JWTprivateKey },
    verify: { algorithms: ['RS256'], key: JWTpublicKey }
  });
  app.register(fastifyCookie);

  app.decorate("userRepo", userRepo);
  app.decorate("hasher", hasher);

  // app.options("/*", (request, reply) => {
  //   reply
  //     .header("Access-Control-Allow-Origin", "http://localhost:3000")
  //     .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
  //     .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
  //     .header("Access-Control-Allow-Credentials", "true")
  //     .send();
  // });

  app.register(auth_routes);
  // app.register(loginRoutes);
  // app.register(twoFARoutes);
  // app.register(testeRoutes);
  userDeleted_listener();

  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    ////console.logog("✅ Auth service rodando na porta 4000");
  } catch (err) {
    //console.error("❌ Erro ao iniciar o auth-service:", err);
    process.exit(1);
  }
}

start();
