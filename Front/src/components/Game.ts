// Front/src/components/Game.ts

// -------------------------------------------------
// TYPE DEFINITIONS
// -------------------------------------------------

/**
 * Define o estado completo do jogo.
 * Usar uma interface garante que todos os dados tenham o tipo correto.
 */
interface GameState {
  field_width: number;
  field_height: number;
  paddle_width: number;
  paddle_height: number;
  ball_size: number;
  paddle1: { x: number; y: number };
  paddle2: { x: number; y: number };
  ball: { x: number; y: number };
  score1: number;
  score2: number;
  player1Name: string; // <-- Adicionado
  player2Name: string; // <-- Adicionado
}

/**
 * Tipagem para as mensagens recebidas do servidor WebSocket.
 * O 'type' é a chave para identificar a ação.
 * 'value' pode conter qualquer dado, então usamos 'any' por flexibilidade,
 * mas poderia ser mais específico com um union type.
 */
interface ServerMessage {
  type: string;
  value?: any;
  [key: string]: any; // Permite outras propriedades dinâmicas
}


// -------------------------------------------------
// GAME PAGE RENDER FUNCTION
// -------------------------------------------------

import {
  createFullGameUI,
  UIElements
} from './GameUI';
/**
 * Renderiza a página do jogo de Pong e inicializa a lógica.
 * @param container O elemento HTML onde o jogo será renderizado.
 * @returns Uma função de cleanup para ser chamada quando a página for "desmontada".
 */
export function renderPongGame(container: HTMLElement): () => void {

  let ui: UIElements | null = null;
  // --- 1. CRIAÇÃO DA ESTRUTURA HTML COM TAILWIND ---

  container.innerHTML = '';

  const scoreboardContainer = document.createElement('div');
  scoreboardContainer.id = 'scoreboard';
  scoreboardContainer.className = 'flex justify-around items-center w-full max-w-[800px] mb-4 text-white';

  const player1Info = document.createElement('div');
  player1Info.className = 'flex items-center gap-4';

  const player1NameElement = document.createElement('span');
  player1NameElement.id = 'player1-name';
  player1NameElement.className = 'text-xl font-semibold text-gray-300';
  player1NameElement.textContent = 'Player 1'; // Usa o nome padrão inicial

  const score1Element = document.createElement('span');
  score1Element.id = 'score1';
  score1Element.className = 'text-5xl font-bold font-mono text-neon-green'; // Estilo para o placar do jogador 1
  score1Element.textContent = '0'; // Valor inicial

  player1Info.append(player1NameElement, score1Element);

  const vsElement = document.createElement('span');
  vsElement.className = 'text-2xl font-semibold text-gray-400';
  vsElement.textContent = 'VS';

  const player2Info = document.createElement('div');
  player2Info.className = 'flex items-center gap-4 flex-row-reverse';

  const player2NameElement = document.createElement('span');
  player2NameElement.id = 'player2-name';
  player2NameElement.className = 'text-xl font-semibold text-gray-300';
  player2NameElement.textContent = 'Player 2';

  const score2Element = document.createElement('span');
  score2Element.id = 'score2';
  score2Element.className = 'text-5xl font-bold font-mono text-neon-pink';
  score2Element.textContent = '0';

  player2Info.append(player2NameElement, score2Element);

  scoreboardContainer.append(player1Info, vsElement, player2Info);

  const gameArea = document.createElement('div');
  gameArea.className = 'relative w-full flex justify-center'; // 'relative' é a chave aqui

  const canvas = document.createElement('canvas');
  canvas.id = 'gameCanvas';
  canvas.width = 800;
  canvas.height = 600;
  canvas.className = 'bg-black border-2 border-neon-blue rounded-lg shadow-lg max-w-full';

  const matchmakingUI = document.createElement('div');
  matchmakingUI.id = 'matchmaking-ui';
  matchmakingUI.className = `
        absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
        flex flex-col items-center justify-center p-8 
        bg-arcade-darker/90 backdrop-blur-sm rounded-lg shadow-xl 
        border-2 border-neon-purple w-11/12 max-w-md 
        transition-opacity duration-300`;

  const statusText = document.createElement('p');
  statusText.id = 'status-text';
  statusText.className = 'hidden text-2xl font-bold text-center text-white';
  statusText.textContent = 'Conectando ao servidor...';

  const startButton = document.createElement('button');
  startButton.id = 'accept-match-button';
  startButton.className = 'hidden mt-6 px-8 py-3 bg-neon-green text-arcade-darker font-bold rounded-lg hover:bg-opacity-80 transform hover:scale-105 transition-all duration-200';
  startButton.textContent = 'Aceitar Partida';

  const SearchButton = document.createElement('button');
  SearchButton.id = 'accept-match-button';
  SearchButton.className = 'mt-6 px-8 py-3 bg-neon-green text-arcade-darker font-bold rounded-lg hover:bg-opacity-80 transform hover:scale-105 transition-all duration-200';
  SearchButton.textContent = 'Procurar Partida';

  // Monta a estrutura
  matchmakingUI.append(statusText, startButton, SearchButton);
  gameArea.append(canvas, matchmakingUI);
  container.append(scoreboardContainer, gameArea); // Adiciona a área do jogo completa ao container principal

  // --- 2. OBTENÇÃO DE REFERÊNCIAS AOS ELEMENTOS DO DOM ---

  const ctx = canvas.getContext('2d');


  // Validação para garantir que o contexto do canvas foi obtido
  if (!ctx) {
    console.error("Não foi possível obter o contexto 2D do canvas.");
    statusText.textContent = "Erro: Seu navegador não suporta canvas.";
    return () => { };
  }

  // --- 3. ESTADO E VARIÁVEIS DO JOGO ---

  let ws: WebSocket | null = null;
  let matchStarted: boolean = false;

  const PADDLE_HEIGHT = 70;
  const MIDDLE_TO_Y = (canvas.height - PADDLE_HEIGHT) / 2;

  const gameState: GameState = {
    field_width: canvas.width,
    field_height: canvas.height,
    paddle_width: 10,
    paddle_height: PADDLE_HEIGHT,
    ball_size: 10,
    paddle1: { x: 10, y: MIDDLE_TO_Y },
    paddle2: { x: canvas.width - 20, y: MIDDLE_TO_Y },
    ball: { x: canvas.width / 2, y: canvas.height / 2 },
    score1: 0,
    score2: 0,
    player1Name: 'Player 1', // Nome padrão
    player2Name: 'Player 2', // Nome padrão
  };

  // --- 4. LÓGICA DO JOGO (FUNÇÕES) ---

  /** Desenha todos os elementos do jogo no canvas */
  function drawGame(): void {
    if (!ctx) return;

    // Fundo
    const rectX = 10;
    const rectY = 20;
    const width = 900;
    const height = 900;
    const cssAngle = 55; // O ângulo desejado do CSS
    const colors = {
      0.1: '#067a7a', // Início do gradiente
      0.7: '#442f74', // Meio do gradiente
      0.9: '#853192'  // Fim do gradiente
    };

    // --- Lógica para criar o gradiente com ângulo ---

    // 1. Converter o ângulo do CSS para radianos (usado em funções matemáticas)
    // No CSS, 0deg é para cima, 90deg é para a direita. Na matemática, 0 é para a direita.
    // A fórmula (90 - cssAngle) ajusta essa diferença.
    const angleRad = (0 - cssAngle) * (Math.PI / 180);

    // 2. Calcular os pontos de início (x0, y0) e fim (x1, y1) do gradiente
    // Isso garante que o gradiente cubra todo o retângulo no ângulo correto.
    const length = Math.abs(width * Math.cos(angleRad)) + Math.abs(height * Math.sin(angleRad));
    const x0 = rectX + width / 2 - Math.cos(angleRad) * length / 2;
    const y0 = rectY + height / 2 - Math.sin(angleRad) * length / 2;
    const x1 = rectX + width / 2 + Math.cos(angleRad) * length / 2;
    const y1 = rectY + height / 2 + Math.sin(angleRad) * length / 2;

    // 3. Criar o objeto de gradiente linear com as coordenadas calculadas
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);

    Object.entries(colors).forEach(([offset, color]) => {
      // O 'offset' aqui ainda é uma string, então a conversão é necessária
      grad.addColorStop(parseFloat(offset), color);
    });
    // 5. Preencher o retângulo com o gradiente
    ctx.fillStyle = grad;
    ctx.fillRect(rectX, rectY, width, height);
    ctx.fillRect(0, 0, gameState.field_width, gameState.field_height);

    // Paddle 1
    ctx.fillStyle = '#39FF14';
    ctx.fillRect(gameState.paddle1.x, gameState.paddle1.y, gameState.paddle_width, gameState.paddle_height);

    // Paddle 2
    ctx.fillStyle = '#D946EF';
    ctx.fillRect(gameState.paddle2.x, gameState.paddle2.y, gameState.paddle_width, gameState.paddle_height);

    // Bola (quadrada)
    ctx.fillStyle = '#F97316';
    ctx.beginPath();
    ctx.fillRect(gameState.ball.x, gameState.ball.y, gameState.ball_size, gameState.ball_size);
    ctx.fill();

    // Linha do meio (estética)
    ctx.strokeStyle = '#00FFFF';
    ctx.beginPath();
    ctx.moveTo(gameState.field_width / 2, 0);
    ctx.lineTo(gameState.field_width / 2, gameState.field_height);
    ctx.stroke();
  }

  /** Atualiza o estado do jogo com base nos dados do servidor */
  function updateGameState(data: ServerMessage): void {
    gameState.paddle1.y = data.paddle_player_1_height_position ?? gameState.paddle1.y;
    gameState.paddle1.x = data.paddle_player_1_width_position ?? gameState.paddle1.x;
    gameState.paddle2.y = data.paddle_player_2_height_position ?? gameState.paddle2.y;
    gameState.paddle2.x = data.paddle_player_2_width_position ?? gameState.paddle2.x;
    gameState.ball.y = data.ball_height_position ?? gameState.ball.y;
    gameState.ball.x = data.ball_width_position ?? gameState.ball.x;
    gameState.score1 = data.scoreboard_player_1 ?? gameState.score1;
    gameState.score2 = data.scoreboard_player_2 ?? gameState.score2;
    if (score1Element.textContent !== String(gameState.score1)) {
      score1Element.textContent = String(gameState.score1);
    }
    if (score2Element.textContent !== String(gameState.score2)) {
      score2Element.textContent = String(gameState.score2);
    }
  }


  /** Conecta ao servidor WebSocket e configura os handlers */
  function connect(): void {
    // ws = new WebSocket(`ws://${window.location.hostname}:3001`); // Use este para produção/desenvolvimento
    ws = new WebSocket(`ws://${window.location.hostname}:3001`); // Força localhost para testes locais

    ws.onopen = () => {
      console.log('Conectado ao servidor WebSocket.');
      statusText.textContent = 'Conectado! Autenticando...';
      // Exemplo de autenticação
      ws?.send(JSON.stringify({ type: "AUTHENTICATION_MAKE", value: { userToken: "123456", userId: "player_ts" } }));
    };

    ws.onmessage = (event) => {
      const data: ServerMessage = JSON.parse(event.data);
      console.log('Mensagem recebida:', data);
      statusText.classList.remove('hidden');

      console.log(data.type);
      switch (data.type) {
        case 'OK_USER_AUTHENTICATED':
          statusText.textContent = 'Pronto para jogar?';

          break;
        case 'GAME_WAITING_NEW_PLAYER':
          statusText.textContent = 'Procurando partida...';
          break;
        case 'GAME_CAN_START':
          // ui.matchmakingContainer.style.display = 'flex';
          // ui.matchStatusDisplay.textContent = 'Jogador encontrado! Clique em Aceitar para começar.';
          statusText.textContent = 'Oponente encontrado! Clique para iniciar.';
          startButton.classList.remove('hidden');
          break;
        case 'GAME_FULL':
          statusText.textContent = 'Jogo completo! Preparando para iniciar...';
          updateGameState(data.value);
          drawGame();
          break;
        case 'GAME_COUNT_DOWN':
          statusText.textContent = `Iniciando em: ${data.value}`;
          if (data.value === 0) {
            matchStarted = true;
            matchmakingUI.classList.add('hidden');


          }

          break;
        case 'GAME_STATUS':
          updateGameState(data.value);
          drawGame();
          break;
        case 'GAME_PLAYER_WIN':
          matchmakingUI.classList.remove('hidden');
          statusText.textContent = 'Parabéns, você venceu!';
          matchStarted = false;

          break;
        case 'GAME_PLAYER_LOSE':
          matchmakingUI.classList.remove('hidden');
          statusText.textContent = 'Você perdeu! Mais sorte na próxima.';
          matchStarted = false;

          break;
        case 'GAME_ABORTED':
          matchmakingUI.classList.remove('hidden');
          statusText.textContent = 'Partida abortada: o oponente saiu.';
          matchStarted = false;

          break;
        default:
          console.warn('Tipo de mensagem não tratada:', data.type);
      }
    };

    ws.onclose = () => {
      console.log('Conexão com o servidor perdida.');
      statusText.textContent = 'Desconectado do servidor. Tente recarregar a página.';
      matchStarted = false;
      startButton.classList.add('hidden');
    };

    ws.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
      statusText.textContent = 'Erro de conexão. O servidor está offline?';
    };
  }

  // --- 5. EVENT LISTENERS ---

  const handleStartClick = () => {
    ws?.send(JSON.stringify({ type: 'GAME_START_MATCH' }));
    startButton.classList.add('hidden');
    statusText.textContent = 'Aguardando início...';
  };

  const handlebuscaClick = () => {
    ws?.send(JSON.stringify({ type: 'GAME_CREATE_GLOBAL_MATCH' }));
    SearchButton.classList.add('hidden');

  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!matchStarted) return;
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {

      e.preventDefault();

      if (e.key === 'ArrowUp') {
        ws?.send(JSON.stringify({ type: 'GAME_PADDLE_UP_KEYDOWN' }));
      } else if (e.key === 'ArrowDown') {
        ws?.send(JSON.stringify({ type: 'GAME_PADDLE_DOWN_KEYDOWN' }));
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (!matchStarted) return;
    if (e.key === 'ArrowUp') {
      ws?.send(JSON.stringify({ type: 'GAME_PADDLE_UP_KEYUP' }));
    } else if (e.key === 'ArrowDown') {
      ws?.send(JSON.stringify({ type: 'GAME_PADDLE_DOWN_KEYUP' }));
    }
  };

  startButton.addEventListener('click', handleStartClick);
  SearchButton.addEventListener('click', handlebuscaClick);
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);

  // --- 6. INICIALIZAÇÃO ---

  drawGame(); // Desenha o estado inicial
  connect();  // Inicia a conexão com o servidor

  // --- 7. FUNÇÃO DE CLEANUP ---

  // Retorna uma função que desfaz tudo o que foi feito,
  // essencial para SPAs para evitar memory leaks.
  return () => {
    console.log("Limpando a página do jogo...");
    // Remove event listeners
    window.removeEventListener('keydown', handleKeyDown);
    window.removeEventListener('keyup', handleKeyUp);
    // O event listener do botão não precisa ser removido se o elemento for destruído

    // Fecha a conexão WebSocket
    if (ws) {
      ws.close();
    }

    // Limpa o contêiner
    container.innerHTML = '';
  };
}