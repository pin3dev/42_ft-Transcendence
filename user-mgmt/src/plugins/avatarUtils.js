const path = require('path');
const fs = require('fs');
const fsp = require('fs/promises');
const { v4: uuidv4 } = require('uuid');

const AVATAR_DIR = '/app/avatars';
fsp.mkdir(AVATAR_DIR, { recursive: true }).catch(() => {});

async function saveAvatar(file, userId) {
  if (!file) return null;

  const ext = path.extname(file.filename || '').toLowerCase() || '.png';
  const filename = `${userId}-${uuidv4()}${ext}`;
  const filepath = path.join(AVATAR_DIR, filename);

  console.log(`🖼️ Salvando avatar em: ${filepath}`);

  try {
    if (file.filepath) {
      await fsp.copyFile(file.filepath, filepath);
      console.log('✅ Copiado de arquivo temporário');
    } else if (file.data) {
      await fsp.writeFile(filepath, file.data);
      console.log('✅ Escrito a partir de buffer (.data)');
    } else if (file._buf) {
      await fsp.writeFile(filepath, file._buf);
      console.log('✅ Escrito a partir de buffer (_buf)');
    } else {
      throw new Error('Formato de arquivo não reconhecido');
    }

    return `/avatars/${filename}`;
  } catch (err) {
    console.error('❌ Erro ao salvar avatar:', err);
    throw err;
  }
}

/**
 * Obtém informações sobre um arquivo de avatar
 * @param {string} avatarPath - Caminho relativo do avatar
 * @returns {Object|null} Informações sobre o arquivo ou null se não existir
 */
// function getAvatarFileInfo(avatarPath) {
//   if (!avatarPath) return null;
  
//   const filename = path.basename(avatarPath);
//   const filepath = path.join(AVATAR_DIR, filename);
  
//   console.log(`Tentando localizar avatar: ${filepath}`);
  
//   if (!fs.existsSync(filepath)) {
//     console.log(`Arquivo de avatar não encontrado: ${filepath}`);
    
//     // Se o arquivo não for encontrado e for o default.png, vamos verificar diretamente no diretório de avatares
//     if (filename === 'default.png') {
//       const defaultPath = path.join(AVATAR_DIR, 'default.png');
//       console.log(`Tentando localizar avatar padrão: ${defaultPath}`);
      
//       if (fs.existsSync(defaultPath)) {
//         console.log('Avatar padrão encontrado!');
//         const ext = '.png';
//         const mimetype = 'image/png';
        
//         return {
//           filepath: defaultPath,
//           mimetype,
//           filename
//         };
//       } else {
//         console.log(`Avatar padrão não encontrado: ${defaultPath}`);
//       }
//     }
//     return null;
//   }
  
//   const ext = path.extname(filepath).toLowerCase();
//   const mimetype = ext === '.png' ? 'image/png' : 'image/jpeg';
  
//   console.log(`Avatar encontrado: ${filepath}, mimetype: ${mimetype}`);
  
//   return {
//     filepath,
//     mimetype,
//     filename
//   };
// }

module.exports = {
  saveAvatar,
  // getAvatarFileInfo
};