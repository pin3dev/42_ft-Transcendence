// Schema de headers para autenticação via gateway
const gatewayHeaders = {
    type: "object",
    required: ["x-user-id"],
    properties: {
      "x-user-id": { type: "string" }
    }
  };
  
  // Schema de resposta para GET /user/me
  const getUserMeResponse = {
    200: {
      type: "object",
      properties: {
        name: { type: "string" },
        avatarUrl: { type: "string", format: "uri" }
      }
    },
    401: {
      type: "object",
      properties: {
        error: { type: "string" }
      }
    },
    404: {
      type: "object",
      properties: {
        error: { type: "string" }
      }
    }
  };
  
  module.exports = {
    gatewayHeaders,
    getUserMeResponse
  };
  