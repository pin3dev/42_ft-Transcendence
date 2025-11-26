const { error_responses } = require("./common_schemas"); // consider also common schemas for errors

// schema for responses previwed by auth routes
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





 
  