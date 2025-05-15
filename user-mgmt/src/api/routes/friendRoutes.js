const { sendFriend_controller } = require("../controllers/sendFriend_controller");
const { acceptFriend_controller } = require("../controllers/acceptFriend_controller");
const { sendFriend_schema, acceptFriend_schema } = require("../schemas/friends_schemas");

module.exports = async function (fastify) {
  fastify.post("/user/friends/send", {
    schema: sendFriend_schema,
    handler: sendFriend_controller,
  });

  fastify.post("/user/friends/accept", {
    schema: acceptFriend_schema,
    handler: acceptFriend_controller,
  });
};

