const { gateway_headers, error_responses } = require("./common_schemas");

const getMatchHistory_schema = {
  headers: gateway_headers,
  querystring: {
    type: "object",
    properties: {
      user_id: { type: "string" }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              adversario_id: { type: "string" },
              resultado: { type: "string" },
              placar: { type: "string" },
              data: { type: "string", format: "date-time" },
              tipo: { type: "string" }
            }
          }
        }
      }
    },
    400: error_responses[400],
    404: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        error: { type: "string" }
      }
    },
    500: error_responses[500]
  }
};

module.exports = {
  getMatchHistory_schema
};