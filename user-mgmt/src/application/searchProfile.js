const profileRepo = require("../infrastructure/db/profile_repository");

async function searchProfile({name, id}) {
  
  if (id) {
    const user = await profileRepo.findById(id);
    if (!user) return [];
    return [user];
  }
  
  if (name){
    if (name.length < 2) {
      const err = new Error("Query muito curta");
      err.statusCode = 400;
      throw err;
  }
  return await profileRepo.searchByName(name);
}
  const err = new Error("Nenhum parâmetro de pesquisa fornecido");
  err.statusCode = 400;
  throw err;
}

module.exports = searchProfile;
