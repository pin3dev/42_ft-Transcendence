const { gateway_headers, error_responses } = require("./common_schemas");


// ✏️ PATCH /user/profile
const updateUser_schema = {
  headers: gateway_headers,
  response: {
    200: {
      type: "object",
      properties: {
        name: { type: "string" },
        avatar_path: { type: "string" },
      },
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" }
      }
    },
    404: error_responses[404],
  },
};

// GET /user/profile - sem validação de resposta para permitir JSON ou binário
const getUser_schema = {
  headers: gateway_headers,
  query: {
    type: "object",
    properties: {
      avatar_only: { type: "string", enum: ["true", "false"] }
    }
  },
  response: {
    // Removemos a validação de resposta específica para permitir tanto JSON quanto binário
  }
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