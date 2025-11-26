const client = require("prom-client");

module.exports = function setupMetrics(app, serviceName, customMetrics) {
  const register = new client.Registry();

  register.setDefaultLabels({
    service: serviceName
  });

  // Métricas padrão do Node.js (CPU, RAM, GC...)
  // client.collectDefaultMetrics({ register });

  Object.values(customMetrics).forEach((metric) =>
    register.registerMetric(metric)
  );

  app.get("/metrics", async (req, reply) => {
    reply.header("Content-Type", register.contentType);
    return register.metrics();
  });

  return customMetrics;
};
