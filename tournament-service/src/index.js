// tournament-service/index.js
const db = require("./db/init"); // ativa foreign keys e cria as tabelas
require("./listeners/tournamentCreated.listener"); // escuta evento de criação de torneio
require("./listeners/matchFinished.listener");     // escuta evento de finalização de partida

console.log("🎯 Tournament service iniciado e ouvindo eventos...");
