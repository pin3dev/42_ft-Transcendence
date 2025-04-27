const User = require("../../domain/entities/user"); // agora usamos a entidade

async function loginUser(email, password, { userRepo, hasher }) {
  const userData = await userRepo.findByEmail(email);
  
  if (!userData) {
    throw new Error("Usuário não encontrado");
  }

  const user = new User({
    id: userData.id,
    email: userData.email,
    passwordHash: userData.password,
    twoFASecret: userData.twoFASecret
  });

  const senhaCorreta = await hasher.compare(password, user.passwordHash);

  if (!senhaCorreta) {
    throw new Error("Credenciais inválidas");
  }

  if (user.requiresTwoFA()) {
    return {
      status: "2FA_REQUIRED",
      userId: user.id
    };
  }

  throw new Error("2FA não configurado. Conta inválida.");
}

module.exports = { loginUser };
