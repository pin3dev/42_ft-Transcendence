const fetch = require("node-fetch");

module.exports = function mountMetricsAggregator(app, metrics) {
  app.get("/metrics", async (req, reply) => {
    try {
      // 1️⃣ MÉTRICAS LOCAIS (gateway)
      const localMetrics = metrics._collectMetrics
        ? await metrics._collectMetrics()
        : "";

      // 2️⃣ LISTA DE SERVIÇOS A COLETAR
      const services = [
        { name: "auth-service", url: `http://auth-service:${process.env.PORT_AUTH_SERVICE}/metrics` },
        { name: "user-mgmt", url: `http://user-mgmt:${process.env.PORT_USER_MGMT}/metrics` },
        // { name: "tournament-service", url: `http://tournament-service:${process.env.PORT_TOURNAMENT_SERVICE}/metrics` },
        // adicione o que quiser
      ];

      // 3️⃣ COLETAR MÉTRICAS DE CADA SERVIÇO
      const remoteMetrics = await Promise.all(
        services.map(async (svc) => {
          try {
            const res = await fetch(svc.url, { timeout: 2000 });
            if (!res.ok) throw new Error(`status ${res.status}`);

            const text = await res.text();
            return `# --- metrics from ${svc.name} ---\n\n${text}`;
          } catch (err) {
            return `# --- metrics from ${svc.name} unreachable: ${err.message} ---\n`;
          }
        })
      );

      // 4️⃣ MONTAR RESPOSTA FINAL
      reply.header(
        "Content-Type",
        "text/plain; version=0.0.4; charset=utf-8"
      );

      return [
        `# --- metrics from api-gateway ---`,
        localMetrics,
        ...remoteMetrics
      ].join("\n\n");

    } catch (err) {
      reply.code(500).send(err.message || String(err));
    }
  });
};
