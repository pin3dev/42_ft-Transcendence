class User {
  constructor(email, passwordHash, twoFASecret = null) {
    this.id = null; // será atribuído depois
    this.email = email;
    this.passwordHash = passwordHash;
    this.twoFASecret = twoFASecret;
  }

  setId(id) {
    this.id = id;
  }

  requiresTwoFA() {
    return !!this.twoFASecret; // Verifica se o usuário tem 2FA habilitado
  }
}

module.exports = User; 