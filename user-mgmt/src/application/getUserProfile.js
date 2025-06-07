const profileRepo = require("../infrastructure/db/profile_repository");

async function getUserProfile(userId, options = {}) {
  const profile = await profileRepo.findById(userId);

  if (!profile) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }

  const GATEWAY_BASE_URL = process.env.GATEWAY_URL || "https://localhost";

  return {
    name: profile.name,
    avatar_url: profile.avatar_path
      ? `${GATEWAY_BASE_URL}/static${profile.avatar_path}`
      : `${GATEWAY_BASE_URL}/static/avatars/default.png`
  };
}

module.exports = getUserProfile;
