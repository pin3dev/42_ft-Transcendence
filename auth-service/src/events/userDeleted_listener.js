const { subscribeToEvent, EventTypes } = require("../../pckg/redis/modules.js");

const userRepo = require("../infrastructure/db/user_repository.js");

function userDeleted_listener() {
  subscribeToEvent(EventTypes.USER_DELETED, async (event) => {
    const { user_id, email } = event.data;

    try {
      // você pode também logar o email se quiser confirmar identidade
      await userRepo.deleteById(user_id, email);
      //console.logog(`[user-mgmt] Perfil deletado para userId=${user_id}`);
    } catch (err) {
      console.error("[user-mgmt] Erro ao deletar perfil:", err);
    }
  });
}

module.exports = {
  userDeleted_listener,
};
