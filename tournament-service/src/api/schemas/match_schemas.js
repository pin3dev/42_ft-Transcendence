const { gateway_headers, error_responses } = require("./common_schemas");

const getMatchHistory_schema = {
  headers: gateway_headers,
  params: {
    type: "object",
    properties: {
      userId: { type: "string" }
    },
    required: ["userId"]
  },
  response: {
    200: {
      type: "object",
      properties: {
        success: { type: "boolean" },
        data: {
          type: "object",
          properties: {
            matches: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  matchId: { type: "string" },
                  opponent: {
                    type: "object",
                    properties: {
                      userId: { type: "string" }
                    }
                  },
                  result: {
                    type: "object",
                    properties: {
                      won: { type: "boolean" },
                      status: { type: "string" }
                    }
                  },
                  score: { type: "string" },
                  date: { type: "string", format: "date-time" },
                  duration: {
                    type: "object",
                    properties: {
                      total_seconds: { type: "integer" },
                      formatted: { type: "string" }
                    }
                  },
                  gameType: { type: "string" },
                  tournament: {
                    type: ["object", "null"],
                    properties: {
                      id: { type: "string" },
                      isPrivate: { type: "boolean" }
                    }
                  }
                }
              }
            },
            total: { type: "integer" }
          }
        }
      }
    },
    400: error_responses[400],
    500: error_responses[500]
  }
};

module.exports = {
  getMatchHistory_schema
};