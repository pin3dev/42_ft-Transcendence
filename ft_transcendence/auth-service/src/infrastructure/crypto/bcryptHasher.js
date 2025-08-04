
const bcrypt = require("bcrypt"); 
const SALT_ROUNDS = 10; // Define o número de rounds de sal — quanto maior, mais seguro (e lento)

async function hashPassword(password) {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

async function compare(password, hashed) {
  return await bcrypt.compare(password, hashed);
}

module.exports = { hashPassword, compare };