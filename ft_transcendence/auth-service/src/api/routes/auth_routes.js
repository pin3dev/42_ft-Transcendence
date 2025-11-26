const { register_schema, login_schema , twoFA_schema } = require("../schemas/user_schemas");
const { twoFA_controller } = require("../controllers/twoFA_controller");
const { register_controller } = require("../controllers/register_controller");
const { login_controller } = require("../controllers/login_controller");
const { logout_controller } = require("../controllers/logout_controller");
const { getToken_controller } = require("../controllers/getToken_controller");

module.exports = async function (fastify) {
  fastify.post("/auth/2fa", {
    schema: twoFA_schema,
    handler: twoFA_controller
  });

  fastify.post("/auth/register", {
    schema: register_schema,
    handler: register_controller
  });

  fastify.post("/auth/login", {
    schema: login_schema,
    handler: login_controller
  });

  fastify.post("/auth/logout", {
    handler: logout_controller
  });

  // route to get JWT token (WebSocket)
  fastify.get("/auth/get-token", {
    handler: getToken_controller
  });
};
