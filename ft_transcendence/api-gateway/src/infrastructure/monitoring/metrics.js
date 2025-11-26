const client = require("prom-client");

module.exports = {
  gatewayRouted: new client.Counter({
    name: "gateway_routed_events_total",
    help: "Eventos roteados pelo gateway",
    labelNames: ["target"],
  }),

  gatewayDenied: new client.Counter({
    name: "gateway_denied_total",
    help: "Autenticação negada",
  }),
};
