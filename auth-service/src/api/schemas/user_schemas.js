const { error_responses } = require("./common_schemas");

// const registerBody = {
//     type: "object",
//     required: ["email", "password"],
//     properties: {
//       email: { type: "string", format: "email" },
//       password: { type: "string", minLength: 6 }
//     }
//   };
  
//   const registerResponse = {
//     201: {
//       type: "object",
//       properties: {
//         userId: { type: "number" },
//         message: { type: "string" },
//         otpauthUrl: { type: "string" }
//       }
//     },
//     400: {
//       type: "object",
//       properties: {
//         error: { type: "string" }
//       }
//     }
//   };

//   const loginBody = {
//     type: "object",
//     required: ["email", "password"],
//     properties: {
//       email: { type: "string", format: "email" },
//       password: { type: "string", minLength: 6 }
//     }
//   };
  
//   const loginResponse = {
//     200: {
//           type: "object",
//           properties: {
//             userId: { type: "number" },
//             status: { type: "string", enum: ["2FA_REQUIRED"] },
//             message: { type: "string" },
//             otpauthUrl: { type: "string" }
//           },
//           required: ["userId", "status"]
//         },
//     401: {
//       type: "object",
//       properties: {
//         error: { type: "string" }
//       }
//     }
//   };
// // mudar nome da var de "token" para "jwt"
//   const twoFABody = {
//     type: "object",
//     required: ["userId", "token"], 
//     properties: {
//       userId: { type: "number" },
//       token: {
//         type: "string",
//         minLength: 6,
//         maxLength: 6,
//         pattern: "^[0-9]{6}$"
//       }
//     }
//   };
//   // mudar o nome da var de "token" para "otp"
//   const twoFAResponse = {
//     200: {
//       type: "object",
//       properties: {
//         message: { type: "string" },
//         userId: { type: "number" },
//         token: { type: "string" } 
//       },
//       required: ["message", "userId", "token"] 
//     },
//     401: {
//       type: "object",
//       properties: {
//         error: { type: "string" }
//       }
//     }
//   };
  
//   module.exports = {
//     registerBody,
//     registerResponse,
//     loginBody,
//     loginResponse,
//     twoFABody, 
//     twoFAResponse 
//   };

const register_schema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 }
    }
  },
  response: {
    201: {
      type: "object",
      properties: {
        user_id: { type: "number" },
        message: { type: "string" },
        qr_code: { type: "string" }
      }
    },
    400: error_responses[400],
  }
};

const login_schema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6 }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        user_id: { type: "number" },
        status: { type: "string", enum: ["2FA_REQUIRED"] },
        message: { type: "string" },
        qr_code: { type: "string" }
      },
      required: ["user_id", "status"]
    },
    401: error_responses[401],
  }
};

const twoFA_schema = {
  body: {
    type: "object",
    required: ["user_id", "otp"],
    properties: {
      user_id: { type: "number" },
      otp: {
        type: "string",
        minLength: 6,
        maxLength: 6,
        pattern: "^[0-9]{6}$"
      }
    }
  },
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" }
      },
      required: ["message"]
    },
    401: error_responses[401],
  }
};

module.exports = {
  register_schema,
  login_schema,
  twoFA_schema,
};





 
  