const profileRepo = require("../infrastructure/db/profile_repository");

async function getUserProfile(userId, options = {}) {
  const profile = await profileRepo.findById(userId);

  if (!profile) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }
  
  const GATEWAY = Buffer.from(process.env.LOCAL_IP_BASE64, 'base64').toString('utf-8');

  return {
    name: profile.name,
    avatar_url: profile.avatar_path
      ? `https://${GATEWAY}/static${profile.avatar_path}`
      : `https://${GATEWAY}/static/avatars/default.png`
  };
}

module.exports = getUserProfile;
