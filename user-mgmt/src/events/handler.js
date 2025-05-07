const { subscribeToEvent, EventTypes } = require("../../packages/event-bus/src/index.js");

const UserProfile = require("../domain/userProfile.js");
const profileRepo = require("../infrastructure/db/profileRepository.js");

function handleUserRegistered() {
  subscribeToEvent(EventTypes.USER_REGISTERED, async (event) => {
    const { userId, email } = event.data;

    try {
      const profile = await UserProfile.create({ userId, email }, profileRepo.nameExists);
      await profileRepo.save(profile);
      console.log(`[user-mgmt] Perfil criado para ${profile.name}`);
    } catch (err) {
      console.error("[user-mgmt] Erro ao criar perfil:", err);
    }
  });
}

module.exports = {
  handleUserRegistered,
};
