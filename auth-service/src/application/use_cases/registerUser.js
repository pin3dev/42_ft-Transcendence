const User = require("../../domain/entities/user"); // Entidade
const speakeasy = require("speakeasy"); // Para gerar o segredo TOTP
const { publishEvent, EventTypes } = require("../../../packages/event-bus/src/index.js"); // Importa o EventBus

async function registerUser(email, password, { userRepo, hasher }) {
  const existing = await userRepo.findByEmail(email);
  if (existing) {
    throw new Error("Email já cadastrado.");
  }

  const hashed = await hasher.hashPassword(password);

  // 🔐 Gera segredo 2FA para o novo usuário
  const secret = speakeasy.generateSecret({
    name: `Transcendence:${email}` // aparece no app do Google Authenticator
  });

  // Cria entidade User com segredo
  const user = new User(email, hashed, secret.base32);

  const saved = await userRepo.save(user);
  user.setId(saved.lastID); // Define ID depois de salvar

  // Após salvar o usuário no banco, publica o evento
  await publishEvent(EventTypes.USER_REGISTERED, {
    userId: user.id,
    email: user.email
  }, "auth-service");

  return {
    userId: user.id,
    otpauthUrl: secret.otpauth_url // usado no frontend para exibir o QR Code
  };
}

module.exports = { registerUser };
