const { gateway_headers, error_responses } = require("./common_schemas");

// ✉️ POST /friends/request
const sendFriend_schema = {
  headers: gateway_headers,
  body: {
    type: "object",
    required: ["target_id"],
    properties: {
      target_id: { type: "string", minLength: 1 },
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

// ✅ POST /friends/accept
const acceptFriend_schema = {
  headers: gateway_headers,
  body: {
    type: "object",
    required: ["sender_id"],
    properties: {
      sender_id: { type: "string", minLength: 1 },
    },
  },
  response: {
    200: {
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
  acceptFriend_schema,
};
