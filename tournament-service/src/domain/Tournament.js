// /tournament-service/domain/Tournament.js
class Tournament {
    static MAX_PLAYERS = 16;
    static MIN_PLAYERS = 2;
  
    constructor({ id, isPrivate, ownerId, password, started, createdAt, players = [] }) {
      this.id = id;
      this.isPrivate = isPrivate;
      this.ownerId = ownerId;
      this.password = password || null;
      this.started = started;
      this.createdAt = createdAt;
      this.players = players;
    }
  
    isValidPlayerCount() {
      return (
        this.players.length >= Tournament.MIN_PLAYERS &&
        this.players.length <= Tournament.MAX_PLAYERS
      );
    }
  
    addPlayer(playerId) {
      if (this.players.includes(playerId)) return;
      if (this.players.length >= Tournament.MAX_PLAYERS) {
        throw new Error("Limite de jogadores atingido.");
      }
      this.players.push(playerId);
    }
  
    isPrivateTournament() {
      return this.isPrivate === true && !!this.password;
    }
  }
  
  module.exports = { Tournament };
  