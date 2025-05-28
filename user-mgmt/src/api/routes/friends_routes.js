const { sendFriend_controller } = require("../controllers/sendFriend_controller");
const { acceptFriend_controller } = require("../controllers/acceptFriend_controller");
const { getFriends_controller } = require("../controllers/getFriends_controller");
const { removeFriend_controller } = require("../controllers/removeFriend_controller");
const { rejectFriend_controller } = require("../controllers/rejectFriend_controller");
const { pendingFriends_controller } = require("../controllers/pendingFriends_controller");
const { 
  sendFriend_schema, 
  acceptFriend_schema, 
  getFriends_schema, 
  removeFriend_schema, 
  rejectFriend_schema,
  pendingFriends_schema,
} = require("../schemas/friends_schemas");

module.exports = async function (fastify) {
  fastify.post("/user/friends/send", {
    schema: sendFriend_schema,
    handler: sendFriend_controller,
  });

  fastify.post("/user/friends/accept", {
    schema: acceptFriend_schema,
    handler: acceptFriend_controller,
  });

  fastify.get("/user/friends", {
    schema: getFriends_schema,
    handler: getFriends_controller,
  });

  fastify.delete("/user/friends/remove", {
    schema: removeFriend_schema,
    handler: removeFriend_controller,
  });

  fastify.post("/user/friends/reject", {
    schema: rejectFriend_schema,
    handler: rejectFriend_controller,
  });

  fastify.get("/user/friends/pending", {
    schema: pendingFriends_schema,
    handler: pendingFriends_controller,
  });
};

