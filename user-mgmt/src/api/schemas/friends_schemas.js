const { gateway_headers, error_responses } = require("./common_schemas");

// ✉️ POST /user/friends/request
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

// ✅ POST /user/friends/request
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

// GET /user/friends
const getFriends_schema = {
  headers: gateway_headers,
  response: {
    200: {
      type: "object",
      properties: {
        friends: {
          type: "array",
          items: {
            type: "object",
            properties: {
              friend_id: { type: "string" },
              since: { type: "string", format: "date-time" },
            },
          },
        },
      },
    },
    401: error_responses[401],
    500: error_responses[500],
  },
};

const removeFriend_schema = {
  headers: gateway_headers,
  body: {
    type: "object",
    required: ["target_id"],
    properties: {
      target_id: { type: "string" },
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

// const rejectFriend_schema = {
//   headers: gateway_headers,
//   body: {
//     type: "object",
//     required: ["sender_id"],
//     properties: {
//       sender_id: { type: "string" },
//     },
//   },
//   response: {
//     200: {
//       type: "object",
//       properties: {
//         message: { type: "string" },
//       },
//     },
//     400: error_responses[400],
//     401: error_responses[401],
//   },
// };


module.exports = {
  sendFriend_schema,
  acceptFriend_schema,
  getFriends_schema,
  removeFriend_schema,
  // rejectFriend_schema,
};
