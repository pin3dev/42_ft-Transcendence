const { subscribeToEvent, EventTypes } = require("../../pckg/redis/modules.js");
const UserProfile = require("../domain/UserProfile.js");
const profileRepo = require("../infrastructure/db/profile_repository.js");

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
