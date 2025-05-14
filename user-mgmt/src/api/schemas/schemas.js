const { gateway_headers, error_responses } = require("./common_schemas");

// 📦 GET /user/profile
const getUser_schema = {
  headers: gateway_headers,
  response: {
    200: {
      type: "object",
      properties: {
        name: { type: "string" },
        avatar_url: { type: "string", format: "uri" }
      },
      401: error_responses[401],
      404: error_responses[404],
    },
  },
};

// ✏️ PUT /user/profile
const updateUser_schema = {
  headers: gateway_headers,
  body: {
    type: "object",
    required: ["name", "avatar_url"],
    properties: {
      name: { type: "string" },
      avatar_url: { type: "string" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        name: { type: "string" },
        avatar_url: { type: "string" },
      },
    },
    404: error_responses[404],
  },
};

// ❌ DELETE /user/profile
const deleteUser_schema = {
  headers: gateway_headers,
  response: {
    204: { type: "null" },
    404: error_responses[404],
  },
};

module.exports = {
  getUser_schema,
  updateUser_schema,
  deleteUser_schema,
};