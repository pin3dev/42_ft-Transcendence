
const bcrypt = require("bcrypt"); 
const SALT_ROUNDS = 10; // define the rounds of salt (amount of hashing iterations)

async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function compare(password, hashed) {
  return await bcrypt.compare(password, hashed);
}

module.exports = { hashPassword, compare };