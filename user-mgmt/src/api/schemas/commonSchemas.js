// 🔐 Headers definidos pelo API Gateway depois de autenticar JWT
const gateway_headers = {
    type: "object",
    required: ["x-user-id"],
    properties: {
      "x-user-id": { type: "string" }
    }
  };

// Schemas gerais para erros HTTP
const error_responses = {
    400: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    401: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    404: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
    500: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  };

  module.exports = {
    gateway_headers,
    error_responses,
  };