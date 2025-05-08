const profileRepository = require("../infrastructure/db/profileRepository");

async function updateUserProfile(userId, { name, avatarUrl }) {
  const existing = await profileRepository.findById(userId);

  if (!existing) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }

  const updated = await profileRepository.update(userId, { name, avatarUrl });
  console.log('UPDATED ROW:', updated);
  return {
    name: updated.name,
    avatarUrl: updated.avatar_url,
  };
}

module.exports = updateUserProfile;
