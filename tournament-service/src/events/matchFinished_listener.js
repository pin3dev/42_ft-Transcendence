const { subscribeToEvent, EventTypes } = require("../../pckg/redis/modules.js");
const { insertMatch } = require("../infrastructure/repositories/match_repository");
const ranking = require("../infrastructure/repositories/ranking_repository");
const { Match } = require("../domain/Match");

function matchFinished_listener() {
	subscribeToEvent(EventTypes.MATCH_FINISHED, async (event) => {
		console.log("🎧 Ouvindo MATCH_FINISHED...");

		try {
			const matchData = event.data;
			const match = new Match(matchData);

			if (!match.isValidMatch()) {
				throw new Error("Dados da partida inválidos");
			}

			await insertMatch(match);
			console.log(`📊 Partida ${match.id} registrada.`);

			const player1Id = match.player1Id;
			const player2Id = match.player2Id;
			const whoWin = match.whoWin;

			const player1Rating = await ranking.getOrCreateRanking(player1Id);
			const player2Rating = await ranking.getOrCreateRanking(player2Id);

			const [player1RatingNew, player2RatingNew] = ranking.calculateRating(player1Rating, player2Rating, whoWin);

			await ranking.updateRanking(String(player1Id), String(player1RatingNew));
			await ranking.updateRanking(String(player2Id), String(player2RatingNew));

			console.log(`🏅 Ranking atualizado: ${player1Id} → ${player1RatingNew}, ${player2Id} → ${player2RatingNew}`);

		} catch (err) {
			console.error("Erro ao processar partida:", err.message);
		}
	});
}

module.exports = {
	matchFinished_listener,
};