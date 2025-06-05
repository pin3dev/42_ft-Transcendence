const matchRepo = require("../infrastructure/db/match_repository");
// const rankingRepo = require("../infrastructure/db/ranking_repository");

async function getUserStats(userId) {
  return await matchRepo.getStats(userId);
}

module.exports = { getUserStats };
