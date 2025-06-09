const profileRepo = require("../infrastructure/db/profile_repository");
const friendsRepo = require("../infrastructure/db/friends_repository");
const { publishEvent, EventTypes, setCache } = require("../../pckg/redis/modules.js"); 

async function deleteUserProfile(userId) {
  const existing = await profileRepo.findById(userId);

  if (!existing) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }
  
  await publishEvent(EventTypes.USER_DELETED, {
    user_id: existing.user_id,
    email: existing.email
  }, "user-mgmt");

  await setCache(`delUser:${existing.user_id}`, true, null);
  
  // Remove todas as relações de amizade do usuário
  await friendsRepo.deleteAllUserRelations(userId);
  
  await profileRepo.delete(userId);
}

module.exports = deleteUserProfile;
