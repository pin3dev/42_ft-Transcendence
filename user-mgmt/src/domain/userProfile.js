class UserProfile {
  constructor({ userId, name, avatarUrl }) {
    this.userId = userId;
    this.name = name;
    this.avatarUrl = avatarUrl;
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

  static async create({ userId, email }, checkNameExists) {
    const baseName = this.slugifyEmail(email);
    const name = await this.generateUniqueName(baseName, checkNameExists);
    const avatarUrl = "/avatars/default.jpg"; // ou um caminho relativo no volume

    return new UserProfile({ userId, name, avatarUrl });
  }
}

module.exports = UserProfile;

  