const profileRepo = require("../infrastructure/db/profile_repository");
const { getAvatarFileInfo } = require("../plugins/avatarUtils");

async function getUserProfile(userId, options = {}) {
  const profile = await profileRepo.findById(userId);

  if (!profile) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }

  // Construir o objeto de resposta
  const result = {
    name: profile.name,
    avatar_path: profile.avatar_path
  };

  // Se o cliente solicitar informações do arquivo de avatar
  if (options.includeAvatarFile) {
    result.avatarFile = getAvatarFileInfo(profile.avatar_path);
  }

  return result;
}

module.exports = getUserProfile;
