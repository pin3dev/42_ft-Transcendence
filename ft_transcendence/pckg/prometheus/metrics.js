const client = require("prom-client");

module.exports = function setupMetrics(app, serviceName) {
  const register = new client.Registry();

  // Coletar métricas padrão do Node
  client.collectDefaultMetrics({ register });

  // Contador de requisições
  const httpRequestCounter = new client.Counter({
    name: "http_requests_total",
    help: "Total de requisições HTTP",
    labelNames: ["service", "method", "route", "statusCode"],
  });
  register.registerMetric(httpRequestCounter);

  // Tempo de requisição (latência)
  const httpRequestDuration = new client.Histogram({
    name: "http_request_duration_seconds",
    help: "Duração das requisições HTTP",
    labelNames: ["service", "method", "route"],
    buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.3, 0.5, 1, 2, 5]
  });
  register.registerMetric(httpRequestDuration);

  // Hooks 
  app.addHook("onRequest", async (req, reply) => {
    req.startTime = process.hrtime();
  });

  app.addHook("onResponse", async (req, reply) => {
    const diff = process.hrtime(req.startTime);
    const duration = diff[0] + diff[1] / 1e9;

    httpRequestCounter.inc({
      service: serviceName,
      method: req.method,
      route: req.routerPath || req.url,
      statusCode: reply.statusCode,
    });

    httpRequestDuration.observe(
      {
        service: serviceName,
        method: req.method,
        route: req.routerPath || req.url
      },
      duration
    );
  });

  // Rota 
  app.get("/metrics", async (req, reply) => {
    reply.header("Content-Type", register.contentType);
    return register.metrics();
  });

  return register;
};
