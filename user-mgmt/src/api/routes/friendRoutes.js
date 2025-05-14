const { sendFriend_controller } = require("../controllers/sendFriend_controller");
const { sendFriend_schema } = require("../schemas/friends_schemas");

module.exports = async function (fastify) {
  fastify.post("/user/friends/send", {
    schema: sendFriend_schema,
    handler: sendFriend_controller,
  });
};

