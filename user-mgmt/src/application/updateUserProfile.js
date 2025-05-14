const profileRepo = require("../infrastructure/db/profile_repository");

async function updateUserProfile(userId, { name, avatar_url }) {
  const existing = await profileRepo.findById(userId);

  if (!existing) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }

  const updated = await profileRepo.update(userId, { name, avatar_url });
  console.log('UPDATED ROW:', updated);
  return {
    name: updated.name,
    avatar_url: updated.avatar_url,
  };
}

module.exports = updateUserProfile;
