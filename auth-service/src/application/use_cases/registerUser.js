const User = require("../../domain/entities/user"); 
const speakeasy = require("speakeasy"); 
const { publishEvent, EventTypes } = require("../../../packages/event-bus/src/index.js"); 

async function registerUser(email, password, { userRepo, hasher }) {
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw new Error("Email já cadastrado.");
  }

  const hashed = await hasher.hashPassword(password);

  const secret = speakeasy.generateSecret({
    name: `Transcendence:${email}` 
  });

  const user = new User(email, hashed, secret.base32);

  const saved = await userRepo.save(user);
  user.setId(saved.lastID); 

  await publishEvent(EventTypes.USER_REGISTERED, {
    userId: user.id,
    email: user.email
  }, "auth-service");

  return {
    userId: user.id,
    otpauthUrl: secret.otpauth_url 
  };
}

module.exports = { registerUser };
