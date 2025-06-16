class UserProfile {
  constructor({ user_id, name, avatarPath }) {
    this.userId = user_id;
    this.name = name;
    this.avatarPath = avatarPath;
    this.updatedAt = new Date().toISOString();
  }

  static slugifyEmail(email) {
    return email.split('@')[0].replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  }

  static async generateUniqueName(baseName, checkExistsFn) {
    let name = baseName;
    let counter = 1;

    while (await checkExistsFn(name)) {
      name = `${baseName}-${counter}`;
      counter++;
    }

    return name;
  }

  static async create({ user_id, email }, checkNameExists) {
    const baseName = this.slugifyEmail(email);
    const name = await this.generateUniqueName(baseName, checkNameExists);
    const avatarPath = "/avatars/default.png"; // Caminho padrão para avatar

    return new UserProfile({ user_id, name, avatarPath });
  }

  // Método para validar avatar atualizado
  static validateAvatar(file) {
    if (!file) return null;

    //console.log("Validando avatar:", {
      filename: file.filename,
      mimetype: file.mimetype,
      temFilePath: !!file.filepath
    });

    const allowedFormats = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSizeMB = 2;
    const maxSize = maxSizeMB * 1024 * 1024;

    // Verificar formato
    if (!file.mimetype || !allowedFormats.includes(file.mimetype)) {
      console.error(`Formato de imagem inválido: ${file.mimetype}`);
      const error = new Error(`Formato de imagem inválido. Apenas JPEG e PNG são permitidos.`);
      error.statusCode = 400;
      throw error;
    }

    // Verificar tamanho se disponível
    // Nota: Com @fastify/multipart, o tamanho pode não estar diretamente disponível
    if (file.size && file.size > maxSize) {
      console.error(`Tamanho da imagem excede o limite: ${file.size} bytes`);
      const error = new Error(`Tamanho da imagem excede ${maxSizeMB} MB.`);
      error.statusCode = 400;
      throw error;
    }

    return file;
  }
}

module.exports = UserProfile;

