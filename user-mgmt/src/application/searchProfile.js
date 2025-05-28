const profileRepo = require("../infrastructure/db/profile_repository");

async function searchProfile(nameQuery) {
  if (!nameQuery || nameQuery.length < 2) {
    const err = new Error("Query muito curta");
    err.statusCode = 400;
    throw err;
  }

  return await profileRepo.searchByName(nameQuery);
}

module.exports = searchProfile;
