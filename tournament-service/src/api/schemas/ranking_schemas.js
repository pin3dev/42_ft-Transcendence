const { gateway_headers, error_responses } = require("./common_schemas");

const getTopRanking_schema = {
  headers: gateway_headers,
  querystring: {
    type: "object",
    properties: {
      limit: { type: "string", pattern: "^[0-9]+$" }
    }
  },
  response: {
    200: {
      type: "array",
      items: {
        type: "object",
        properties: {
          user_id: { type: "string" },
          score: { type: "integer" },
          total_wins: { type: "integer" },
          total_losses: { type: "integer" },
          win_rate: { type: "string" }
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
        total_wins: { type: "integer" },
        total_losses: { type: "integer" },
        score: { type: "integer" }
      }
    },
    401: error_responses[401],
    500: error_responses[500]
  }
};

const getFriendStats_schema = {
  headers: gateway_headers,
  querystring: {
    type: "object",
    properties: {
      user_id: { type: "string" }
    },
    required: ["user_id"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        total_wins: { type: "integer" },
        total_losses: { type: "integer" },
        score: { type: "integer" }
      }
    },
    400: error_responses[400],
    500: error_responses[500]
  }
};

module.exports = {
  getTopRanking_schema,
  getUserStats_schema,
  getFriendStats_schema,
};