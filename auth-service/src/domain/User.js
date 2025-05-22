class User {
  constructor(email, passwordHash, twoFASecret = null) {
    this.id = null; 
    this.email = email;
    this.passwordHash = passwordHash;
    this.twoFASecret = twoFASecret;
  }

  setId(id) {
    this.id = id;
  }

  requiresTwoFA() {
    return !!this.twoFASecret; 
  }
}

module.exports = User; 