const profileRepository  = require("../infrastructure/db/profileRepository");

async function getUserProfile(userId) {
  const profile = await profileRepository.findById(userId);

  if (!profile) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    name: profile.name,
    avatarUrl: profile.avatar_url,
  };
}

module.exports = getUserProfile;
