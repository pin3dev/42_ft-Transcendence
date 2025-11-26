const Fastify = require("fastify");
// const path = require("path");
// const fs = require("fs");
const fastifyJwt = require("@fastify/jwt");
const fastifyCookie = require('@fastify/cookie');

const auth_routes = require("./api/routes/auth_routes");

const userRepo = require("./infrastructure/db/user_repository");
const hasher = require("./infrastructure/crypto/bcryptHasher");
const { userDeleted_listener } = require("./events/userDeleted_listener");
const setupMetrics = require("../pckg/prometheus/metrics.js");
const authMetrics = require("./infrastructure/monitoring/metrics.js");

const JWTprivateKey = Buffer.from(process.env.JWT_PRIVATE_KEY_BASE64, 'base64').toString('utf-8');
const JWTpublicKey = Buffer.from(process.env.JWT_PUBLIC_KEY_BASE64, 'base64').toString('utf-8');
const PORT = process.env.PORT;

async function start() {
  const app = Fastify(/* { logger: true } */);

  app.register(fastifyJwt, {
    secret: {
      private: JWTprivateKey,
      public: JWTpublicKey
    },
    sign: { algorithm: 'RS256', key: JWTprivateKey },
    verify: { algorithms: ['RS256'], key: JWTpublicKey }
  });
  app.register(fastifyCookie);

  const metrics = setupMetrics(app, "auth-service", authMetrics);
  app.decorate("metrics", metrics);

  app.decorate("userRepo", userRepo);
  app.decorate("hasher", hasher);


  app.register(auth_routes);
  userDeleted_listener();

  try {
    await app.listen({ port: PORT, host: '0.0.0.0' });
  } catch (err) {
    // console.error("❌ Erro ao iniciar o auth-service:", err);
    process.exit(1);
  }
}

start();
