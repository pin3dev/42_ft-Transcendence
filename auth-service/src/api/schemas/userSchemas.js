const registerBody = {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 }
    }
  };
  
  const registerResponse = {
    201: {
      type: "object",
      properties: {
        userId: { type: "number" },
        message: { type: "string" },
        otpauthUrl: { type: "string" }
      }
    },
    400: {
      type: "object",
      properties: {
        error: { type: "string" }
      }
    }
  };

  const loginBody = {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 }
    }
  };
  
  const loginResponse = {
    200: {
          type: "object",
          properties: {
            userId: { type: "number" },
            status: { type: "string", enum: ["2FA_REQUIRED"] },
            message: { type: "string" },
            otpauthUrl: { type: "string" }
          },
          required: ["userId", "status"]
        },
    401: {
      type: "object",
      properties: {
        error: { type: "string" }
      }
    }
  };
// mudar nome da var de "token" para "jwt"
  const twoFABody = {
    type: "object",
    required: ["userId", "token"], 
    properties: {
      userId: { type: "number" },
      token: {
        type: "string",
        minLength: 6,
        maxLength: 6,
        pattern: "^[0-9]{6}$"
      }
    }
  };
  // mudar o nome da var de "token" para "otp"
  const twoFAResponse = {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        userId: { type: "number" },
        token: { type: "string" } 
      },
      required: ["message", "userId", "token"] 
    },
    401: {
      type: "object",
      properties: {
        error: { type: "string" }
      }
    }
  };
  
  module.exports = {
    registerBody,
    registerResponse,
    loginBody,
    loginResponse,
    twoFABody, 
    twoFAResponse 
  };
