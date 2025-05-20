const { register_schema, login_schema , twoFA_schema } = require("../schemas/user_schemas");
const { twoFA_controller } = require("../controllers/twoFA_controller");
const { register_controller } = require("../controllers/register_controller");
const { login_controller } = require("../controllers/login_controller");

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
};
