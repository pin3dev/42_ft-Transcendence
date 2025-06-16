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

function calculateRating(ratingPlayer1, ratingPlayer2, winner) {

	let k = 32;

		const expectedA = 1 / (1 + Math.pow(10, (ratingPlayer2 - ratingPlayer1) / 400));
		const expectedB = 1 - expectedA;

		let scoreA;
		let scoreB;

		switch (winner) {

			//player 1 win
			case -1:
				scoreA = 1;
				scoreB = 0;
				break;

			//player 2 win
			case 1:
				scoreA = 0;
				scoreB = 1;
				break;

			//was an draw
			case 0:
				scoreA = 0.5;
				scoreB = 0.5;
				break;
		}

		const newRatingPlayer1 = ratingPlayer1 + k * (scoreA - expectedA);
		const newRatingPlayer2 = ratingPlayer2 + k * (scoreB - expectedB);

		return [Math.round(newRatingPlayer1), Math.round(newRatingPlayer2)];
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
  calculateRating,
  getTopPlayers,
};