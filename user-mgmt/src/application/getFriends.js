const { listAccepted } = require("../infrastructure/db/friends_repository");
const profileRepo = require("../infrastructure/db/profile_repository");
const { getCache } = require("../../pckg/redis/modules");


async function getFriends(userId) {
  try {
    const rows = await listAccepted(userId);

    // Extrai os friend_ids corretamente
    const friendIds = rows.map(row =>
      row.user_id === userId ? row.friend_id : row.user_id
    );

    const profiles = await profileRepo.findManyByIds(friendIds);
    //console.log("🧠 Perfis retornados:", profiles);
    //console.log("📌 Tipo de profiles:", Array.isArray(profiles) ? "array" : typeof profiles);

    const GATEWAY = Buffer.from(process.env.LOCAL_IP_BASE64, 'base64').toString('utf-8');

    // Mapear os amigos com status online/offline
    const friendsWithStatus = await Promise.all(
      rows.map(async (row) => {
        const fid = row.user_id === userId ? row.friend_id : row.user_id;

        let profile = null;
        if (Array.isArray(profiles)) {
          profile = profiles.find(p => p.user_id === fid);
        }

        // Verificar status online no cache
        let isOnline = false;
        try {
          const onlineStatus = await getCache(`user_status:${fid}`);
          isOnline = onlineStatus ? JSON.parse(onlineStatus) === true : false;
        } catch (error) {
          console.warn(`⚠️ Erro ao verificar status online para user ${fid}:`, error);
          isOnline = false;
        }

        return {
          user_id: fid,
          status: row.status || "ACCEPTED",
          name: profile?.name || "Desconhecido",
          avatar_url: profile?.avatar_path
            ? `https://${GATEWAY}/static${profile.avatar_path}`
            : `https://${GATEWAY}/static/avatars/default.png`,
          since: row.updated_at,
          is_online: isOnline,
        };
      })
    );

    return friendsWithStatus;
  } catch (err) {
    console.error("❌ Erro ao buscar amigos:", err);
    throw new Error("Erro ao listar amizades.");
  }
}

module.exports = getFriends;