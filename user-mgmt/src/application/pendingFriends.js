const { listPending } = require("../infrastructure/db/friends_repository");
const profileRepo = require("../infrastructure/db/profile_repository");

async function pendingFriends(userId) {
  //console.log("📥 Buscando solicitações pendentes para:", userId);

  const requests = await listPending(userId);
  //console.log("🔎 Solicitações encontradas:", requests);

  const requesterIds = requests.map(r => r.user_id);

  const profiles = await profileRepo.findManyByIds(requesterIds);
  //console.log("👤 Perfis encontrados:", profiles);

  const GATEWAY = Buffer.from(process.env.LOCAL_IP_BASE64, 'base64').toString('utf-8');

  return requests.map(req => {
    const profile = profiles.find(p => p.user_id === req.user_id);
    return {
      user_id: req.user_id,
      name: profile?.name || "Desconhecido",
      avatar_url: profile?.avatar_path
        ? `https://${GATEWAY}/static${profile.avatar_path}`
        : `https://${GATEWAY}/static/avatars/default.png`,
      since: req.created_at
    };
  });
}

module.exports = pendingFriends;
