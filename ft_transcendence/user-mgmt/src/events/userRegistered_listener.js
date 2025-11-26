const { subscribeToEvent, EventTypes } = require("../../pckg/redis/modules.js");
const UserProfile = require("../domain/UserProfile.js");
const profileRepo = require("../infrastructure/db/profile_repository.js");

function userRegistered_listener(app) {
  subscribeToEvent(EventTypes.USER_REGISTERED, async (event) => {
    const { user_id, email } = event.data;

    try {
      const profile = await UserProfile.create({ user_id, email }, profileRepo.nameExists);
      await profileRepo.save(profile);
      //console.logog(`[user-mgmt] Perfil criado para ${profile.name}`);
      // created profile metrics
      app.metrics.profileCreated.inc(); 
    } catch (err) {
      app.metrics.profileCreationFailed.inc();
      console.error("[user-mgmt] Erro ao criar perfil:", err);
    }
  });
}

module.exports = {
  userRegistered_listener,
};
