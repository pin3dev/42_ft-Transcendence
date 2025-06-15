// Verifica se a variável ws já existe para evitar conflito com game.js
if (typeof ws === 'undefined') {
  var ws = new WebSocket("ws://" + window.location.host);

  ws.onmessage = (event) => {
    const message = JSON.parse(event.data);

    switch (message.type) {
      case 'TOURNAMENT_OVERALL_SCOREBOARD':
        renderScoreboard(message.value);
        break;
      case 'TOURNAMENT_TABLE_OF_POINTS':
        renderRanking(message.value);
        break;
      case 'ERROR_TOURNAMENT_FULL':
      case 'ERROR_TOURNAMENT_IN_PROGRESS':
      case 'ERROR_TOURNAMENT_FINISHED':
      case 'ERROR_TOURNAMENT_DOESNT_EXIST':
      case 'ERROR_TOURNAMENT_ALREADY_EXISTS':
      case 'ERROR_TOURNAMENT_CREATING_ODD_PLAYERS':
      case 'ERROR_TOURNAMENT_CREATING_FEW_PLAYERS':
      case 'ERROR_TOURNAMENT_CREATING_MANY_PLAYERS':
      case 'ERROR_TOURNAMENT_ALREADY_PARTICIPATING':
        alert("Error: " + message.type + (message.value !== null ? (" - " + message.value) : ""));
        break;
    }
  };
}

function renderScoreboard(data) {
  const container = document.getElementById("scoreboards");
  if (!container) return;
  let html = `<table><tr><th>Player 1</th><th>Score</th><th>Player 2</th><th>Score</th></tr>`;
  data.forEach(row => {
    html += `<tr><td>${row.player1Name}</td><td>${row.player1Score}</td><td>${row.player2Name}</td><td>${row.player2Score}</td></tr>`;
  });
  html += `</table>`;
  container.innerHTML = html;
}

function renderRanking(data) {
  const container = document.getElementById("ranking");
  if (!container) return;
  let html = `<table><tr><th>#</th><th>Player</th><th>Matches</th><th>Starts</th><th>Victories</th><th>+Pts</th><th>Pts</th></tr>`;
  data.forEach(row => {
    html += `<tr><td>${row.position}</td><td>${row.playerName}</td><td>${row.numOfMatch}</td><td>${row.starts}</td><td>${row.numberOfVictories}</td><td>${row.pointsMake}</td><td>${row.pointsBalance}</td></tr>`;
  });
  html += `</table>`;
  container.innerHTML = html;
}

function sendTournamentCreate() {
  if (typeof ws !== 'undefined') {
    ws.send(JSON.stringify({ type: 'TOURNAMENT_CREATE' }));
  }
}

function sendTournamentJoin() {
  if (typeof ws !== 'undefined') {
    ws.send(JSON.stringify({ type: 'TOURNAMENT_TO_PARTICIPATE' }));
  }
}

// Botões
window.addEventListener('DOMContentLoaded', () => {
  const createBtn = document.getElementById('createBtn');
  const joinBtn = document.getElementById('joinBtn');
  if (createBtn) createBtn.onclick = sendTournamentCreate;
  if (joinBtn) joinBtn.onclick = sendTournamentJoin;
});
