const { listAccepted } = require("../infrastructure/db/friends_repository");
const profileRepo = require("../infrastructure/db/profile_repository");

async function getFriends(userId) {
  try {
    const rows = await listAccepted(userId);

    // Extrai os friend_ids corretamente
    const friendIds = rows.map(row =>
      row.user_id === userId ? row.friend_id : row.user_id
    );

    const profiles = await profileRepo.findManyByIds(friendIds);
    console.log("🧠 Perfis retornados:", profiles);
    console.log("📌 Tipo de profiles:", Array.isArray(profiles) ? "array" : typeof profiles);

    const GATEWAY = process.env.GATEWAY_URL || "https://localhost";

    return rows.map(row => {
      const fid = row.user_id === userId ? row.friend_id : row.user_id;
      // const profile = profiles.find(p => p.user_id === fid);

      let profile = null;
      if (Array.isArray(profiles)) {
        profile = profiles.find(p => p.user_id === fid);
      }

      return {
        user_id: fid,
        status: row.status || "ACCEPTED",
        name: profile?.name || "Desconhecido",
        avatar_url: profile?.avatar_path
          ? `${GATEWAY}/static${profile.avatar_path}`
          : `${GATEWAY}/static/avatars/default.png`,
        since: row.updated_at,
      };
    });
  } catch (err) {
    console.error("❌ Erro ao buscar amigos:", err);
    throw new Error("Erro ao listar amizades.");
  }
}

module.exports = getFriends;