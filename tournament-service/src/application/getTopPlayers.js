const rankingRepo = require("../infrastructure/repositories/ranking_repository");
const matchRepo = require("../infrastructure/repositories/match_repository");

async function getTopPlayers(limit = 5) {
  // Busca os top jogadores do ranking
  const topPlayers = await rankingRepo.getTopPlayers(limit);
  
  // Para cada jogador, busca estatísticas adicionais
  const playersWithStats = await Promise.all(
    topPlayers.map(async (player) => {
      const playerId = player.player_id;
      const matchStats = await matchRepo.getStats(playerId);
      
      // Calcula taxa de aproveitamento (win rate)
      const totalGames = matchStats.totalWins + matchStats.totalLosses;
      let win_rate = "N/A";
      
      if (totalGames > 0) {
        const winRatePercent = (matchStats.totalWins / totalGames) * 100;
        win_rate = `${winRatePercent.toFixed(1)}%`;
      }
      
      return {
        user_id: playerId,
        score: player.score,
        total_wins: matchStats.totalWins,
        total_losses: matchStats.totalLosses,
        win_rate
      };
    })
  );
  
  return playersWithStats;
}

module.exports = { getTopPlayers };