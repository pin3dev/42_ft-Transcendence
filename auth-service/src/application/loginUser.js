const User = require("../domain/User"); 
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

async function loginUser(email, password, { userRepo, hasher }) {
  const userData = await userRepo.findByEmail(email);
  
  if (!userData) {
    throw new Error("Usuário não encontrado");
  }

  const user = new User(
    userData.email,           
    userData.password,        
    userData.twoFASecret      
  );

  user.setId(userData.id);

  const senhaCorreta = await hasher.compare(password, user.passwordHash);

  if (!senhaCorreta) {
    throw new Error("Credenciais inválidas");
  }

  if (user.requiresTwoFA()) {
    let otpauthUrl = null;
    let qrCodeImage = null;
    
    if (!userData.first2FALoginDone) {
      console.log("Primeira vez com 2FA, gerando QR para:", user.email);
      otpauthUrl = speakeasy.otpauthURL({
        secret: user.twoFASecret,
        label: `Transcendence:${user.email}`,
        encoding: "base32"
      });

      qrCodeImage = await QRCode.toDataURL(otpauthUrl);
    }

    const response = {
      status: "2FA_REQUIRED",
      user_id: user.id,
      ...(qrCodeImage && { qr_code: qrCodeImage }),
    };

    console.log("Resposta final do loginUser:", response);
    return response;
  }

  throw new Error("2FA não configurado. Conta inválida.");
}

module.exports = { loginUser };
