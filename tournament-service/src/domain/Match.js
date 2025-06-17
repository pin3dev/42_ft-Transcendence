// /tournament-service/src/domain/Match.js
class Match {
    constructor({ id, tournamentId, player1Id, player2Id, winnerId, score, startedAt, endedAt }) {
      this.id = id;
      this.tournamentId = tournamentId;
      this.player1Id = player1Id;
      this.player2Id = player2Id;
      this.winnerId = winnerId;
      this.score = score;
      this.startedAt = startedAt;
      this.endedAt = endedAt;
    }

    isValidMatch() {
    return (
      this.id &&
      this.player1Id &&
      this.player2Id &&
      this.score &&
      this.startedAt &&
      this.endedAt &&
      this.player1Id !== this.player2Id
    );
  }

    isDraw() {
    return !this.winnerId || this.winnerId === null;
  }

    getLoserId() {
      if (this.isDraw()) {
        return null; // Não há perdedor em empate
      }
      return this.winnerId === this.player1Id ? this.player2Id : this.player1Id;
    }
  }

  module.exports = { Match };