const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getOrCreateRanking(playerId) {
  let ranking = await prisma.ranking.findUnique({ where: { player_id: playerId } });
  if (!ranking) {
    ranking = await prisma.ranking.create({
      data: { player_id: playerId, score: 1000 },
    });
  }
  return ranking;
}

async function updateRanking(playerId, newScore) {
  await prisma.ranking.update({
    where: { player_id: playerId },
    data: { score: newScore, last_updated: new Date() },
  });
}

function calculateElo(winnerScore, loserScore) {
  const K = 32;
  const expectedWinner = 1 / (1 + Math.pow(10, (loserScore - winnerScore) / 400));
  const expectedLoser = 1 - expectedWinner;
  const newWinner = Math.round(winnerScore + K * (1 - expectedWinner));
  const newLoser = Math.round(loserScore + K * (0 - expectedLoser));
  return { newWinner, newLoser };
}

async function getTopPlayers(limit = 5) {
  return await prisma.ranking.findMany({
    orderBy: { score: 'desc' },
    take: limit,
  });
}

module.exports = {
  getOrCreateRanking,
  updateRanking,
  calculateElo,
  getTopPlayers,
};