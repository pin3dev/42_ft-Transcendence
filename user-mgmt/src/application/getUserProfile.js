const profileRepo  = require("../infrastructure/db/profile_repository");

async function getUserProfile(userId) {
  const profile = await profileRepo.findById(userId);

  if (!profile) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }

  return {
    name: profile.name,
    avatar_url: profile.avatar_url,
  };
}

module.exports = getUserProfile;
