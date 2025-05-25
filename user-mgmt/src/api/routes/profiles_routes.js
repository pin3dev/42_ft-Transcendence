const { getUser_controller } = require("../controllers/getUser_controller");
const { updateUser_controller } = require("../controllers/updateUser_controller");
const { deleteUser_controller } = require("../controllers/deleteUser_controller");
const { getUser_schema, updateUser_schema, deleteUser_schema } = require("../schemas/profiles_schemas");

module.exports = async function (fastify) {
  fastify.get("/user/profile", {
    schema: getUser_schema,
    handler: getUser_controller,
  });

  fastify.patch("/user/profile", {
    schema: updateUser_schema,
    handler: updateUser_controller,
  });

  fastify.delete("/user/profile", {
    schema: deleteUser_schema,
    handler: deleteUser_controller,
  });
};
