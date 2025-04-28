const Fastify = require("fastify");
const registerRoutes = require("./api/routes/register");
const loginRoutes = require("./api/routes/login");
const twoFARoutes = require("./api/routes/2fa");

const userRepo = require("./infrastructure/db/userRepoSqlite");
const hasher = require("./infrastructure/crypto/bcryptHasher");

const path = require("path");
const fs = require("fs");
const fastifyJwt = require("@fastify/jwt");

async function start() {
  const app = Fastify({ logger: true });

  // 🔐 Lê as chaves
  const privateKey = fs.readFileSync(path.join(__dirname, "../keys/private.key"), "utf8");
  const publicKey = fs.readFileSync(path.join(__dirname, "../keys/public.key"), "utf8");

  // 🔑 Registra o plugin JWT corretamente
  app.register(fastifyJwt, {
    secret: {
      private: privateKey,
      public: publicKey
    },
    sign: { algorithm: 'RS256', key: privateKey },
    verify: { algorithms: ['RS256'], key: publicKey }
  });

  app.decorate("userRepo", userRepo);
  app.decorate("hasher", hasher);

  app.register(registerRoutes);
  app.register(loginRoutes);
  app.register(twoFARoutes);

  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    console.log("✅ Auth service rodando na porta 4000");
  } catch (err) {
    console.error("❌ Erro ao iniciar o auth-service:", err);
    process.exit(1);
  }
}

start();

/*const Fastify = require("fastify");
const registerRoutes = require("./api/routes/register");
const loginRoutes = require("./api/routes/login");
const twoFARoutes = require("./api/routes/2fa");

const userRepo = require("./infrastructure/db/userRepoSqlite");
const hasher = require("./infrastructure/crypto/bcryptHasher");

async function start() {
  const app = Fastify({ logger: true });

  app.decorate("userRepo", userRepo);
  app.decorate("hasher", hasher);

  app.register(registerRoutes);
  app.register(loginRoutes);
  app.register(twoFARoutes);

  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    console.log("✅ Auth service rodando na porta 4000");
  } catch (err) {
    console.error("❌ Erro ao iniciar o auth-service:", err);
    process.exit(1);
  }
}

start();*/
