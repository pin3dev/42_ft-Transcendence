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
  
    getLoserId() {
      return this.winnerId === this.player1Id ? this.player2Id : this.player1Id;
    }
  }
  
  module.exports = { Match };
  