const rankingRepo = require("../infrastructure/db/ranking_repository");
const profileRepo = require("../infrastructure/db/profile_repository");

async function getTopPlayersWithProfiles() {
  const topPlayers = await rankingRepo.getTopPlayers(5);
  const ids = topPlayers.map(p => p.player_id);
  const profiles = await profileRepo.findManyByIds(ids);

  return topPlayers.map(p => {
    const profile = profiles.find(pr => pr.user_id === p.player_id);
    return {
      user_id: p.player_id,
      name: profile?.name || "Desconhecido",
      avatar_url: profile?.avatar_url || null,
      score: p.score
    };
  });
}

module.exports = { getTopPlayersWithProfiles };
