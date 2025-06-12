const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function insertMatch(match) {
  await prisma.match.create({
    data: {
      id: match.id,
      tournament_id: match.tournamentId,
      player1_id: match.player1Id,
      player2_id: match.player2Id,
      winner_id: match.winnerId,
      score: match.score,
      started_at: match.startedAt,
      ended_at: match.endedAt,
    },
  });
}

async function getStats(userId) {
  const totalWins = await prisma.match.count({ where: { winner_id: userId } });
  const totalLosses = await prisma.match.count({
    where: {
      AND: [
        { OR: [{ player1_id: userId }, { player2_id: userId }] },
        { NOT: { winner_id: userId } },
      ],
    },
  });
  return { totalWins, totalLosses };
}

module.exports = { insertMatch, getStats };
