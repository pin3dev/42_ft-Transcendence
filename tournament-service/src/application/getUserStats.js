const matchRepo = require("../infrastructure/db/match_repository");
const rankingRepo = require("../infrastructure/db/ranking_repository");

async function getUserStats(userId) {
  // Busca estatísticas de vitórias e derrotas no match repository
  const matchStats = await matchRepo.getStats(userId);
  
  // Busca o score no ranking repository
  const rankingData = await rankingRepo.getOrCreateRanking(userId);
  
  // Combina os dados de ambos os repositórios
  return {
    total_wins: matchStats.totalWins || 0,
    total_losses: matchStats.totalLosses || 0,
    score: rankingData.score || 1000
  };
}

module.exports = { getUserStats };
