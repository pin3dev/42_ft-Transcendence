const { gateway_headers, error_responses } = require("./common_schemas");

const getTopRanking_schema = {
  headers: gateway_headers,
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user_id: { type: "string" },
          name: { type: "string" },
          avatar_url: { type: "string", format: "uri" },
          score: { type: "integer" }
        }
      }
    },
    500: error_responses[500]
  }
};

const getUserStats_schema = {
  headers: gateway_headers,
  response: {
    200: {
      type: "object",
      properties: {
        totalWins: { type: "integer" },
        totalLosses: { type: "integer" }
      }
    },
    401: error_responses[401],
    500: error_responses[500]
  }
};

module.exports = {
  getTopRanking_schema,
  getUserStats_schema,
};