const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const statusDiv = document.getElementById('status');

let ws;
let playerIndex = null; // 0 ou 1
let matchStarted = false;

let PADDLE_HEIGHT = 70;
let MIDDLE_TO_Y = (canvas.width - PADDLE_HEIGHT) / 2;

let gameState = {
	field_width: canvas.width,
	field_height: canvas.height,
	paddle_width: 10,
	paddle_height: 70,
	ball_size: 10,
	middle_y_to_paddle: (MIDDLE_TO_Y),

	paddle1: { x: 10, y: MIDDLE_TO_Y },
	paddle2: { x: canvas.width - 20, y: MIDDLE_TO_Y },
	ball: { x: canvas.width / 2, y: canvas.height / 2 },
	score1: 0,
	score2: 0,
	countdown: null,
};

//ws = new WebSocket(`ws://${window.location.host}`); = ws://localhost:3000:
//
//ws = new WebSocket(`ws://${window.location.hostname}:3001`) = ws://localhost
//

// Conecta no WebSocket do servidor
function connect() {
	ws = new WebSocket(`ws://${window.location.hostname}:3001`);

	ws.onopen = () => {

		ws.send(JSON.stringify({ type: "AUTHENTICATION_MAKE", value: { userToken: "123456", userId: "xxxxx" } }));

		statusDiv.textContent = 'Conectado! Aguardando outro jogador...';
		ws.send(JSON.stringify({ type: 'GAME_CREATE_GLOBAL_MATCH' }));
	};

	ws.onmessage = (event) => {
		const data = JSON.parse(event.data);

		switch (data.type) {
			case 'OK_USER_AUTHENTICATED':
				break;

			case 'GAME_WAITING_NEW_PLAYER':
				statusDiv.textContent = 'Esperando outro jogador se conectar...';
				break;

			case 'GAME_CAN_START':
				statusDiv.textContent = 'Jogador encontrado! Clique em Start para começar.';
				startButton.style.display = 'inline-block';
				break;

			case 'GAME_FULL':
				playerIndex = data.paddle_player_1_width_position === 10 ? 0 : 1;
				statusDiv.textContent = 'Jogo completo! Preparando para iniciar...';
				updateInformation(data.value);
				updateGameState(data);
				drawGame();
				break;

			case 'GAME_COUNT_DOWN':
				statusDiv.textContent = `Começando em: ${data.value}`;
				if (data.value === 0) {
					matchStarted = true;
					statusDiv.textContent = 'Jogo iniciado! Use ↑ e ↓ para mover o paddle.';
				}
				break;

			case 'GAME_STATUS':
				updateGameState(data.value);
				drawGame();
				break;

			case 'GAME_PLAYER_WIN':
				statusDiv.textContent = `Você venceu!`;
				matchStarted = false;
				startButton.style.display = 'none';
				break;

			case 'GAME_PLAYER_LOSE':
				statusDiv.textContent = `Você perdeu!`;
				matchStarted = false;
				startButton.style.display = 'none';
				break;
			case 'GAME_PLAYER_DRAW':
				statusDiv.textContent = 'Empate!';
				matchStarted = false;
				startButton.style.display = 'none';
				break;
			case 'GAME_ABORTED':
				statusDiv.textContent = 'Partida abortada. Um jogador saiu.';
				matchStarted = false;
				startButton.style.display = 'none';
				break;

			default:
				console.warn('Tipo de mensagem não tratado:', data.type);
		}
	};

	ws.onclose = () => {
		statusDiv.textContent = 'Conexão perdida com o servidor.';
		matchStarted = false;
		startButton.style.display = 'none';
	};
}

function updateGameState(data) {
	if (data.paddle_player_1_height_position !== undefined)
		gameState.paddle1.y = data.paddle_player_1_height_position;

	if (data.paddle_player_1_width_position !== undefined)
		gameState.paddle1.x = data.paddle_player_1_width_position;

	if (data.paddle_player_2_height_position !== undefined)
		gameState.paddle2.y = data.paddle_player_2_height_position;

	if (data.paddle_player_2_width_position !== undefined)
		gameState.paddle2.x = data.paddle_player_2_width_position;

	if (data.ball_y_position !== undefined)
		gameState.ball.y = data.ball_y_position;

	if (data.ball_x_position !== undefined)
		gameState.ball.x = data.ball_x_position;

	if (data.scoreboard_player_1 !== undefined)
		gameState.score1 = data.scoreboard_player_1;

	if (data.scoreboard_player_2 !== undefined)
		gameState.score2 = data.scoreboard_player_2;
}

function updateInformation(game) {

	gameState.field_width = game.field_width;
	gameState.field_height = game.field_height;

	gameState.width = game.paddle_width;
	gameState.paddle_height = game.paddle_height;

	gameState.ball_size = game.ball_size;

	if (game.paddle_player_1_height_position !== undefined)
		gameState.paddle1.y = game.paddle_player_1_height_position;

	if (game.paddle_player_1_width_position !== undefined)
		gameState.paddle1.x = game.paddle_player_1_width_position;

	if (game.paddle_player_2_height_position !== undefined)
		gameState.paddle2.y = game.paddle_player_2_height_position;

	if (game.paddle_player_2_width_position !== undefined)
		gameState.paddle2.x = game.paddle_player_2_width_position;

	console.log(game);
	console.log('atualizado');

}

// Desenhar tudo no canvas
function drawGame() {
	ctx.clearRect(0, 0, gameState.field_width, gameState.field_height);

	// Fundo
	ctx.fillStyle = '#000';
	ctx.fillRect(0, 0, gameState.field_width, gameState.field_height);

	// Paddle 1
	ctx.fillStyle = 'white';
	ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.width, gameState.paddle_height);

	// Paddle 2
	ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.width, gameState.paddle_height);

	// Bola
	ctx.beginPath();
	//ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball_size / 2, 0, Math.PI * 2); //bola redonda
	ctx.fillRect(gameState.ball.x, gameState.ball.y, gameState.ball_size, gameState.ball_size); //bola 'quadrada'
	ctx.fill();

	// Placar
	ctx.font = '24px Arial';
	ctx.fillText(`Player 1: ${gameState.score1}`, 20, 30);
	ctx.fillText(`Player 2: ${gameState.score2}`, gameState.field_width - 140, 30);
}

// Quando o botão "Start Match" for clicado, envia sinal para o servidor
startButton.onclick = () => {
	ws.send(JSON.stringify({ type: 'GAME_START_MATCH' }));
	startButton.style.display = 'none';
	statusDiv.textContent = 'Esperando o jogo começar...';
};

// Captura as teclas para mover o paddle
window.addEventListener('keydown', (e) => {

	if (!matchStarted) return;

	if (e.key === 'ArrowUp') {
		ws.send(JSON.stringify({ type: 'GAME_PADDLE_UP_KEYDOWN' }));
	} else if (e.key === 'ArrowDown') {
		ws.send(JSON.stringify({ type: 'GAME_PADDLE_DOWN_KEYDOWN' }));
	}

});

window.addEventListener('keyup', (e) => {

	if (!matchStarted) return;

	if (e.key === 'ArrowUp') {
		ws.send(JSON.stringify({ type: 'GAME_PADDLE_UP_KEYUP' }));
		console.log('soltando a seta')
	} else if (e.key === 'ArrowDown') {
		ws.send(JSON.stringify({ type: 'GAME_PADDLE_DOWN_KEYUP' }));
		console.log('soltando a seta')
	}

});



// Inicializa conexão
connect();
drawGame();
