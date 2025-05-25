const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Diretório base para os avatares
const AVATAR_DIR = path.join(__dirname, '../../avatars');

// Garantir que o diretório existe
if (!fs.existsSync(AVATAR_DIR)) {
  fs.mkdirSync(AVATAR_DIR, { recursive: true });
}

/**
 * Salva um avatar no sistema de arquivos
 * @param {Object} file - Objeto do arquivo enviado pelo cliente
 * @param {string} userId - ID do usuário
 * @returns {string} Caminho relativo do avatar salvo
 */
function saveAvatar(file, userId) {
  if (!file) return null;

  console.log("Salvando avatar:", file);
  
  try {
    // Gerar nome único para o arquivo
    const fileExt = path.extname(file.filename).toLowerCase();
    const filename = `${userId}-${uuidv4()}${fileExt}`;
    const filepath = path.join(AVATAR_DIR, filename);
    
    console.log(`Gerando novo avatar: ${filepath}`);
    
    // Verificar como o arquivo está disponível
    if (file.filepath && fs.existsSync(file.filepath)) {
      // Se o arquivo foi salvo em um caminho temporário, copiar de lá
      console.log(`Copiando de arquivo temporário: ${file.filepath}`);
      fs.copyFileSync(file.filepath, filepath);
    } else if (file.data && Buffer.isBuffer(file.data)) {
      // Se temos o conteúdo do arquivo como Buffer
      console.log('Salvando a partir de buffer de dados');
      fs.writeFileSync(filepath, file.data);
    } else {
      // Não foi possível identificar como salvar o arquivo
      console.error('Formato de arquivo não reconhecido:', file);
      throw new Error('Formato de arquivo não reconhecido');
    }
    
    console.log(`Avatar salvo com sucesso em: ${filepath}`);
    
    // Retornar o caminho relativo
    return `/avatars/${filename}`;
  } catch (err) {
    console.error("Erro ao salvar avatar:", err);
    throw err;
  }
}

/**
 * Obtém informações sobre um arquivo de avatar
 * @param {string} avatarPath - Caminho relativo do avatar
 * @returns {Object|null} Informações sobre o arquivo ou null se não existir
 */
function getAvatarFileInfo(avatarPath) {
  if (!avatarPath) return null;
  
  const filename = path.basename(avatarPath);
  const filepath = path.join(AVATAR_DIR, filename);
  
  console.log(`Tentando localizar avatar: ${filepath}`);
  
  if (!fs.existsSync(filepath)) {
    console.log(`Arquivo de avatar não encontrado: ${filepath}`);
    
    // Se o arquivo não for encontrado e for o default.png, vamos verificar diretamente no diretório de avatares
    if (filename === 'default.png') {
      const defaultPath = path.join(AVATAR_DIR, 'default.png');
      console.log(`Tentando localizar avatar padrão: ${defaultPath}`);
      
      if (fs.existsSync(defaultPath)) {
        console.log('Avatar padrão encontrado!');
        const ext = '.png';
        const mimetype = 'image/png';
        
        return {
          filepath: defaultPath,
          mimetype,
          filename
        };
      } else {
        console.log(`Avatar padrão não encontrado: ${defaultPath}`);
      }
    }
    return null;
  }
  
  const ext = path.extname(filepath).toLowerCase();
  const mimetype = ext === '.png' ? 'image/png' : 'image/jpeg';
  
  console.log(`Avatar encontrado: ${filepath}, mimetype: ${mimetype}`);
  
  return {
    filepath,
    mimetype,
    filename
  };
}

module.exports = {
  saveAvatar,
  getAvatarFileInfo
};