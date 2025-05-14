const { gateway_headers, error_responses } = require("./common_schemas");

// ✉️ POST /friends/request
const sendFriend_schema = {
  headers: gateway_headers,
  body: {
    type: "object",
    required: ["friendId"],
    properties: {
      friendId: { type: "string", minLength: 1 },
    },
  },
  response: {
    201: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
    400: error_responses[400],
    401: error_responses[401],
  },
};

module.exports = {
  sendFriend_schema,
};
