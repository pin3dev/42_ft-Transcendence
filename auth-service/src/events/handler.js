const { subscribeToEvent, EventTypes } = require("../../packages/event-bus/src/index.js");

const userRepo = require("../infrastructure/db/userRepoSqlite.js");

function handleUserDeleted() {
  subscribeToEvent(EventTypes.USER_DELETED, async (event) => {
    const { userId, email } = event.data;

    try {
      // você pode também logar o email se quiser confirmar identidade
      await userRepo.deleteById(userId, email);
      console.log(`[user-mgmt] Perfil deletado para userId=${userId}`);
    } catch (err) {
      console.error("[user-mgmt] Erro ao deletar perfil:", err);
    }
  });
}

module.exports = {
  handleUserDeleted,
};
