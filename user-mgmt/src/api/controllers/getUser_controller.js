const getUserProfile = require("../../application/getUserProfile");
const fs = require("fs");
const path = require("path");

async function getUser_controller(request, reply) {
  const user_id = request.headers["x-user-id"];
  
  if (!user_id) {
    return reply.code(401).send({ error: "Unauthorized: missing user ID" });
  }

  try {
    // Verificar se o cliente quer apenas o avatar - garantindo que funcione com string ou booleano
    const avatarOnly = request.query.avatar_only === 'true' || request.query.avatar_only === true;
    
    console.log("Query parameters:", request.query);
    console.log("Avatar only flag:", avatarOnly);
    
    // Se o usuário solicitou apenas o avatar, vamos lidar diretamente com isso
    if (avatarOnly) {
      console.log("Avatar only request detected");
      
      // Buscar o perfil sem incluir dados do arquivo - apenas precisamos do caminho
      const profile = await getUserProfile(user_id, { includeAvatarFile: false });
      
      if (!profile || !profile.avatar_path) {
        return reply.code(404).send({ error: "Avatar not found" });
      }
      
      // Extrair o nome do arquivo do caminho
      const filename = path.basename(profile.avatar_path);
      
      // Construir o caminho absoluto para o arquivo
      const avatarFilePath = path.join(__dirname, '../../../avatars', filename);
      
      console.log(`Trying to serve avatar from: ${avatarFilePath}`);
      
      // Verificar se o arquivo existe
      if (!fs.existsSync(avatarFilePath)) {
        console.log(`Avatar file not found at: ${avatarFilePath}`);
        return reply.code(404).send({ error: "Avatar file not found" });
      }
      
      // Determinar o tipo MIME baseado na extensão do arquivo
      const ext = path.extname(filename).toLowerCase();
      const mimetype = ext === '.png' ? 'image/png' : 'image/jpeg';
      
      // Enviar o arquivo como resposta
      console.log(`Serving avatar file: ${avatarFilePath} with mimetype: ${mimetype}`);
      
      // Usar o método sendFile do Fastify para garantir que a resposta seja tratada como um arquivo
      return reply
        .type(mimetype)
        .send(fs.createReadStream(avatarFilePath));
    }
    
    // Para solicitações normais, retornar o perfil como JSON
    const profile = await getUserProfile(user_id, { includeAvatarFile: false });
    return reply.send(profile);
  } catch (err) {
    console.error("Error in getUser_controller:", err);
    const status = err.statusCode || 500;
    return reply.code(status).send({ error: err.message });
  }
}

module.exports = { getUser_controller };
