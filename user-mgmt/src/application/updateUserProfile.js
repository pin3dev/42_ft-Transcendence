const path = require('path');
const fs = require('fs/promises');
const profileRepo = require("../infrastructure/db/profile_repository");
const UserProfile = require("../domain/UserProfile");
const { saveAvatar } = require("../plugins/avatarUtils");

async function updateUserProfile(userId, body) {
  //console.log("Atualizando perfil:", userId);

  //console.log("🚨 Dados recebidos no body:", body);

  const existing = await profileRepo.findById(userId);
  if (!existing) {
    const error = new Error("Usuário não encontrado");
    error.statusCode = 404;
    throw error;
  }

  if (!body || (!body.name || !body.name.value) && (!body.avatar || !body.avatar.filename)) {
    const error = new Error("Nenhum campo enviado para atualização");
    error.statusCode = 400;
    throw error;
  }

  let name = existing.name;
  let avatarPath = existing.avatar_path;

  if (body.name && body.name.value) {
    const rawName = body.name.value;

    const isValid = /^[a-z0-9-]{3,30}$/.test(rawName);
    if (!isValid) {
      const error = new Error("Nome de usuário inválido. Use apenas letras minúsculas, números e hífens, entre 3 e 30 caracteres.");
      error.statusCode = 400;
      throw error;
    }
  
    name = rawName;
  }

  // Se avatar foi enviado, processar
  if (body.avatar && body.avatar.filename) {
    const avatar = {
      filename: body.avatar.filename,
      mimetype: body.avatar.mimetype,
      size: body.avatar.file?.length || 0,
    };

    UserProfile.validateAvatar(avatar); //passar função para avatarUtils.js
    //console.log("Avatar validado");

    const buffer = await body.avatar.toBuffer();

    // Salva temporariamente
    const tmpDir = path.join(__dirname, '../../tmp');
    await fs.mkdir(tmpDir, { recursive: true });

    const tempFilePath = path.join(tmpDir, `temp-${Date.now()}-${avatar.filename}`);
    await fs.writeFile(tempFilePath, buffer);

    // Passa o arquivo temporário para salvar
    avatar.filepath = tempFilePath;
    avatarPath = await saveAvatar(avatar, userId);

    // Limpa arquivo temporário
    try {
      await fs.unlink(tempFilePath);
      //console.log("Temp removido:", tempFilePath);
    } catch (err) {
      console.warn("Erro limpando temp:", err.message);
    }
  }

  // Atualiza no banco
  const updated = await profileRepo.update(userId, {
    name,
    avatar_path: avatarPath,
  });

  const GATEWAY = Buffer.from(process.env.LOCAL_IP_BASE64, 'base64').toString('utf-8');

  return {
    name: updated.name,
    avatar_url: updated.avatar_path
      ? `https://${GATEWAY}/static${updated.avatar_path}`
      : null,
  };
}

module.exports = updateUserProfile;
