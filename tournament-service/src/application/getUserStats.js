const rankingRepo = require("../infrastructure/db/ranking_repository");

async function getUserStats(userId) {
  return await rankingRepo.getStats(userId);
}

module.exports = { getUserStats };
