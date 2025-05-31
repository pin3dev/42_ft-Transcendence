const Redis = require("ioredis");
const redis = new Redis(); // conecta na porta local 6379

const tournamentCreatedEvent = {
  event: "tournament.created",
  version: "1.0",
  timestamp: new Date().toISOString(),
  source: "game-service",
  data: {
    id: "tourn-001",
    isPrivate: true,
    ownerId: "user-9",
    password: "abc123hash",
    started: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    players: ["user-9", "user-8", "user-7"]
  }
};

const matchFinishedEvent = {
  event: "match.finished",
  version: "1.0",
  timestamp: new Date().toISOString(),
  source: "game-service",
  data: {
    id: "match-01",
    tournamentId: "tourn-001",
    player1Id: "user-9",
    player2Id: "user-7",
    winnerId: "user-9",
    score: "10-7",
    startedAt: new Date().toISOString(),
    endedAt: new Date().toISOString()
  }
};

(async () => {
  await redis.publish("tournament.created", JSON.stringify(tournamentCreatedEvent));
  console.log("🎯 Evento tournament.created publicado");

  setTimeout(async () => {
    await redis.publish("match.finished", JSON.stringify(matchFinishedEvent));
    console.log("🏁 Evento match.finished publicado");
    redis.disconnect();
  }, 1000);
})();
