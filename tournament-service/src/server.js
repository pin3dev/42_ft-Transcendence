require("./infrastructure/db/matches_sql.js");
require("./infrastructure/db/players_sql.js");
require("./infrastructure/db/ranking_sql.js");
require("./infrastructure/db/tournaments_sql.js");

require("./events/matchFinished_listener");
require("./events/tournamentCreated_listener");

console.log("🚀 Tournament service iniciado e ouvindo eventos...");
