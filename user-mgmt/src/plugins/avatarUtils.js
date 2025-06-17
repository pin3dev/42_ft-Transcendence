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

  //console.log(`🖼️ Salvando avatar em: ${filepath}`);

  try {
    if (file.filepath) {
      await fsp.copyFile(file.filepath, filepath);
      //console.log('✅ Copiado de arquivo temporário');
    } else if (file.data) {
      await fsp.writeFile(filepath, file.data);
      //console.log('✅ Escrito a partir de buffer (.data)');
    } else if (file._buf) {
      await fsp.writeFile(filepath, file._buf);
      //console.log('✅ Escrito a partir de buffer (_buf)');
    } else {
      throw new Error('Formato de arquivo não reconhecido');
    }

    return `/avatars/${filename}`;
  } catch (err) {
    console.error('❌ Erro ao salvar avatar:', err);
    throw err;
  }
}

module.exports = {
  saveAvatar,
  // getAvatarFileInfo
};