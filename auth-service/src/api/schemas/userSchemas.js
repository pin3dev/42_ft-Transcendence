// Schema para validação automática do corpo da requisição POST /register
const registerBody = {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 }
    }
  };
  
  // Schema para validar estrutura da resposta (sucesso e erro)
  const registerResponse = {
    201: {
      type: "object",
      properties: {
        userId: { type: "number" },
        message: { type: "string" },
        otpauthUrl: { type: "string" } // <- novo
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
    // 200: {
    //   type: "object",
    //   properties: {
    //     userId: { type: "number" },
    //     message: { type: "string" }
    //   }
    // },
    200: {
      oneOf: [
        {
          type: "object",
          properties: {
            userId: { type: "number" },
            message: { type: "string" }
          },
          required: ["userId", "message"]
        },
        {
          type: "object",
          properties: {
            userId: { type: "number" },
            status: { type: "string", enum: ["2FA_REQUIRED"] },
            message: { type: "string" }
          },
          required: ["userId", "status"]
        }
      ]
    },
    401: {
      type: "object",
      properties: {
        error: { type: "string" }
      }
    }
  };

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
  
  const twoFAResponse = {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
        userId: { type: "number" }
      }
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
    twoFABody, // criado para ser usado na rota 2fa
    twoFAResponse // criado para ser usado na rota 2fa
  };
