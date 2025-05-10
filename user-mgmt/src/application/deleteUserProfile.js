const profileRepository = require("../infrastructure/db/profileRepository");
const { publishEvent, EventTypes, setCache } = require("../../packages/event-bus/src/index.js"); 

async function deleteUserProfile(userId) {
  const existing = await profileRepository.findById(userId);

  if (!existing) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }
  
  await publishEvent(EventTypes.USER_DELETED, {
    userId: existing.user_id,
    email: existing.email
  }, "user-mgmt");

  await setCache(`delUser:${existing.user_id}`, true, null);
  await profileRepository.delete(userId);
}

module.exports = deleteUserProfile;
