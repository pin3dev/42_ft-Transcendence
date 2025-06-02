const { subscribeToEvent, EventTypes } = require("../../pckg/redis/modules.js");
const { insertMatch } = require("../infrastructure/db/match_repository");
const ranking = require("../infrastructure/db/ranking_repository");
const { Match } = require("../domain/Match");

subscribeToEvent(EventTypes.MATCH_FINISHED, async (event) => {
  const matchData = event.data;
  const match = new Match(matchData);

  try {
    await insertMatch(match);
    console.log(`📊 Partida ${match.id} registrada.`);

    const winner = await ranking.getOrCreateRanking(match.winnerId);
    const loser = await ranking.getOrCreateRanking(match.getLoserId());

    const { newWinner, newLoser } = ranking.calculateElo(winner.score, loser.score);

    await ranking.updateRanking(match.winnerId, newWinner);
    await ranking.updateRanking(match.getLoserId(), newLoser);

    console.log(`🏅 Ranking atualizado: ${match.winnerId} → ${newWinner}, ${match.getLoserId()} → ${newLoser}`);
  } catch (err) {
    console.error("Erro ao processar partida:", err.message);
  }
});
