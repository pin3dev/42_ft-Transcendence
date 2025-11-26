const { userRegistered_listener } = require("./events/userRegistered_listener");
const Fastify = require("fastify");
const fastifyMultipart = require("@fastify/multipart");
const fastifyStatic = require("@fastify/static");
const path = require("path");
const fs = require('fs');
const profiles_routes = require("./api/routes/profiles_routes");
const friends_routes = require("./api/routes/friends_routes");
const profileRepo = require("./infrastructure/db/profile_repository");
const friendRepo = require("./infrastructure/db/friends_repository");
const testProtectedRoute = require("./api/routes/test_protected_route");
const setupMetrics = require("../pckg/prometheus/metrics.js");
const userMetrics = require("./infrastructure/monitoring/metrics.js");

const PORT = process.env.PORT;

const fastify = Fastify({ 
  logger: true,
  // Desabilitar a serialização automática para permitir o envio de respostas binária
  disableRequestLogging: false
});

const metrics = setupMetrics(fastify, "user-mgmt", userMetrics);
fastify.decorate("metrics", metrics);

// Garantir que o diretório temporário para uploads exista
const tmpDir = path.join(__dirname, '../tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Configurar o plugin multipart para lidar com upload de arquivos
fastify.register(fastifyMultipart, {
  attachFieldsToBody: true,
  tmpdir: tmpDir,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

// Servir os arquivos estáticos da pasta avatars
fastify.register(fastifyStatic, {
  root: path.join(__dirname, '../avatars'),
  prefix: '/avatars/', // acessar via /avatars/nome.png
});

fastify.decorate("profileRepo", profileRepo);
fastify.decorate("friendRepo", friendRepo);
fastify.register(profiles_routes);
fastify.register(friends_routes);
fastify.register(testProtectedRoute);

fastify.listen({ port: PORT, host: "0.0.0.0" }, (err) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
});

userRegistered_listener(fastify);
