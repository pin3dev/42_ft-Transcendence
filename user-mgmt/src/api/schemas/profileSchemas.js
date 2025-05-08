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

// Schema de requisição para PUT /user/profile
const updateUserProfileRequestSchema = {
  headers: gatewayHeaders,
  body: {
    type: "object",
    required: ["name", "avatar"],
    properties: {
      name: { type: "string" },
      avatar: { type: "string", format: "uri" },
    },
  },
  response: {
    200: {
      type: "object",
      properties: {
        name: { type: "string" },
        avatarUrl: { type: "string", format: "uri" },
      },
    },
    404: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

// Schema de requisição para DELETE /user/profile
const deleteUserProfileRequestSchema = {
  headers: gatewayHeaders,
  response: {
    204: { type: "null" },
    404: {
      type: "object",
      properties: {
        error: { type: "string" },
      },
    },
  },
};

module.exports = {
  gatewayHeaders,
  getUserMeResponse,
  updateUserProfileRequestSchema,
  deleteUserProfileRequestSchema,
};