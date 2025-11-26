const client = require("prom-client");

module.exports = function setupMetrics(app, serviceName, customMetrics, options = {}) {
  const register = new client.Registry();

  register.setDefaultLabels({
    service: serviceName
  });

  // Métricas padrão do Node.js (CPU, RAM, GC...)
  // client.collectDefaultMetrics({ register });

  Object.values(customMetrics).forEach((metric) => {
    register.registerMetric(metric)
    // initialize metrics to avoid NaN issues
    if (metric instanceof client.Counter) {
      metric.inc(0);
    }
    if (metric instanceof client.Gauge) {
      metric.set(0);
    }
  });
  
  Object.defineProperty(customMetrics, "_collectMetrics", {
    value: async () => register.metrics(),
    enumerable: false
  });

  // app.get("/metrics", async (req, reply) => {
  //   reply.header("Content-Type", register.contentType);
  //   return register.metrics();
  // });

  // Expose /metrics endpoint ignoring OPTIONS preflight requests
  if (!options.skipRegisterRoute) {
    app.get("/metrics", async (req, reply) => {
      reply.header(
        "Content-Type",
        "text/plain; version=0.0.4; charset=utf-8"
      );
      return register.metrics();
    });
  }

  return customMetrics;
};
