const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function insertTournament(tournament) {
  await prisma.tournament.create({
    data: {
      id: tournament.id,
      is_private: tournament.isPrivate,
      owner_id: tournament.ownerId,
      password: tournament.password || null,
      started: tournament.started,
      created_at: tournament.createdAt,
    },
  });
}

async function insertPlayers(tournamentId, players) {
  await prisma.player.createMany({
    data: players.map((playerId) => ({
      tournament_id: tournamentId,
      player_id: playerId,
    })),
    // skipDuplicates: true,
  });
}

module.exports = {
  insertTournament,
  insertPlayers,
};
