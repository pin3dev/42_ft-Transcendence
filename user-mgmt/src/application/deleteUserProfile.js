const profileRepository = require("../infrastructure/db/profileRepository");
const { publishEvent, EventTypes } = require("../../packages/event-bus/src/index.js"); 

async function deleteUserProfile(userId) {
  const existing = await profileRepository.findById(userId);

  if (!existing) {
    const error = new Error("User profile not found");
    error.statusCode = 404;
    throw error;
  }
  // await publishEvent(EventTypes.USER_DELETED, {
  //   userId: user.id,
  //   email: user.email
  // }, "user-mgmt");

  await profileRepository.delete(userId);

}

module.exports = deleteUserProfile;
