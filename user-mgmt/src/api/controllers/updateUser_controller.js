const updateUserProfile = require("../../application/updateUserProfile");
const fs = require('fs');

async function updateUser_controller(request, reply) {
  const userId = request.headers["x-user-id"];

  if (!userId) {
    return reply.code(401).send({ error: "Unauthorized: missing user ID" });
  }

  try {
    console.log("Processando requisição de atualização de perfil");
    console.log("Content-Type:", request.headers['content-type']);
    
    // Com attachFieldsToBody: true, os campos estão disponíveis em request.body
    console.log("Body recebido:", request.body);
    
    // Verificar se temos um nome
    if (!request.body || !request.body.name || !request.body.name.value) {
      return reply.code(400).send({ error: "Nome é obrigatório" });
    }
    
    // Inicializar os dados com o nome extraído
    const data = {
      name: request.body.name.value
    };
    
    // Verificar se temos um avatar
    if (request.body.avatar && request.body.avatar.filename) {
      console.log(`Avatar recebido: ${request.body.avatar.filename}`);
      
      // Com attachFieldsToBody: true, o avatar estará em request.body.avatar
      data.avatar = {
        filename: request.body.avatar.filename,
        mimetype: request.body.avatar.mimetype,
        filepath: request.body.avatar.filepath
      };
    }
    
    console.log("Dados extraídos com sucesso:", data);
    
    // Atualizar o perfil
    const result = await updateUserProfile(userId, data);
    return reply.send(result);
  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    const status = err.statusCode || 500;
    return reply.code(status).send({ error: err.message });
  }
}

module.exports = {
  updateUser_controller,
};
