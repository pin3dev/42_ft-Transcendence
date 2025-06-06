const Fastify = require("fastify");
const path = require("path");
const fs = require("fs");
const fastifyJwt = require("@fastify/jwt");
const fastifyCookie = require('@fastify/cookie');

const auth_routes = require("./api/routes/auth_routes");

const userRepo = require("./infrastructure/db/user_repository");
const hasher = require("./infrastructure/crypto/bcryptHasher");
const { handleUserDeleted } = require("./events/handler");


// const privateKey = fs.readFileSync(path.join(__dirname, "../keys/private.key"), "utf8"); // key antiga
// const publicKey = fs.readFileSync(path.join(__dirname, "../keys/public.key"), "utf8"); // key antiga
const privateKey = Buffer.from(process.env.PRIVATE_KEY_BASE64, 'base64').toString('utf-8'); // key nova
const publicKey = Buffer.from(process.env.PUBLIC_KEY_BASE64, 'base64').toString('utf-8'); // key nova


async function start() {
  const app = Fastify({ logger: true });

  app.register(fastifyJwt, {
    secret: {
      private: privateKey,
      public: publicKey
    },
    sign: { algorithm: 'RS256', key: privateKey },
    verify: { algorithms: ['RS256'], key: publicKey }
  });
  app.register(fastifyCookie);

  app.decorate("userRepo", userRepo);
  app.decorate("hasher", hasher);

  app.options("/*", (request, reply) => {
    reply
      .header("Access-Control-Allow-Origin", "http://localhost:3000")
      .header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH")
      .header("Access-Control-Allow-Headers", "Content-Type, Authorization")
      .header("Access-Control-Allow-Credentials", "true")
      .send();
  });

  app.register(auth_routes);
  // app.register(loginRoutes);
  // app.register(twoFARoutes);
  // app.register(testeRoutes);
  handleUserDeleted();

  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    //console.log("✅ Auth service rodando na porta 4000");
  } catch (err) {
    //console.error("❌ Erro ao iniciar o auth-service:", err);
    process.exit(1);
  }
}

start();
