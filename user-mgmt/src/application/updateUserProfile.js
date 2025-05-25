const profileRepo = require("../infrastructure/db/profile_repository");
const UserProfile = require("../domain/UserProfile");
const { saveAvatar } = require("../plugins/avatarUtils");
const fs = require('fs');

async function updateUserProfile(userId, { name, avatar }) {
  console.log("Atualizando perfil para userId:", userId);
  console.log("Dados recebidos:", { name, avatar: avatar ? `${avatar.filename} (${avatar.mimetype})` : null });
  
  const existing = await profileRepo.findById(userId);

  if (!existing) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }

  // Processar o avatar se fornecido
  let avatarPath = existing.avatar_path;
  if (avatar) {
    try {
      // Validar o avatar usando o método da classe de domínio
      UserProfile.validateAvatar(avatar);
      
      console.log("Avatar validado com sucesso");
      
      // Salvar o avatar e obter o novo caminho
      avatarPath = saveAvatar(avatar, userId);
      
      console.log("Avatar salvo em:", avatarPath);
      
      // Limpar arquivos temporários se necessário
      if (avatar.filepath && fs.existsSync(avatar.filepath)) {
        try {
          fs.unlinkSync(avatar.filepath);
          console.log("Arquivo temporário removido:", avatar.filepath);
        } catch (err) {
          console.error("Erro ao remover arquivo temporário:", err);
        }
      }
    } catch (err) {
      console.error("Erro ao processar avatar:", err);
      throw err;
    }
  }

  // Atualizar o perfil no banco de dados
  console.log("Atualizando perfil no banco de dados com:", { name, avatarPath });
  const updated = await profileRepo.update(userId, { 
    name, 
    avatar_path: avatarPath 
  });

  return {
    name: updated.name,
    avatar_path: updated.avatar_path
  };
}

module.exports = updateUserProfile;
