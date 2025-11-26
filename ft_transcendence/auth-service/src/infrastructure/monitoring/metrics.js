const client = require("prom-client");

module.exports = {
  authLoginAttempts: new client.Counter({
    name: "auth_login_attempts_total",
    help: "Tentativas de login",
  }),

  authLoginSuccess: new client.Counter({
    name: "auth_login_success_total",
    help: "Logins com sucesso",
  }),

  authLoginFailed: new client.Counter({
    name: "auth_login_failed_total",
    help: "Logins falhados",
  }),

  authAccountCreated: new client.Counter({
    name: "auth_account_created_total",
    help: "Contas criadas",
  }),

  authAccountCreateFailed: new client.Counter({
    name: "auth_account_create_failed_total",
    help: "Falhas na criação de conta",
  }),

  activeSessions: new client.Gauge({
    name: "auth_active_sessions",
    help: "Sessões ativas",
  }),
};
