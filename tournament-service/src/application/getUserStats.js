const rankingRepo = require("../infrastructure/db/match_repository");

async function getUserStats(userId) {
  return await rankingRepo.getStats(userId);
}

module.exports = { getUserStats };
