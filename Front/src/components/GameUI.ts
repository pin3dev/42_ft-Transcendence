// /frontend/src/components/GameUI.ts

export interface UIElements {
  pageContainer: HTMLDivElement;
  mainContent: HTMLDivElement;
  backgroundTableContainer: HTMLDivElement; // O container da mesa de fundo que se tornará o jogo
  pingPongTableElement: HTMLDivElement; // A div específica da mesa para sobrepor o canvas
  scoreDisplay: HTMLDivElement;
  gameStatusDisplay: HTMLDivElement; // Para "GO!", "FIM DE JOGO", etc.
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D | null;
  matchmakingContainer: HTMLDivElement;
  findMatchButton: HTMLButtonElement;
  matchStatusDisplay: HTMLDivElement; // Para "Buscando...", "Partida encontrada!"
}

export function createFullGameUI(): UIElements {
  const pageContainer = document.createElement('div');
  pageContainer.className = 'min-h-screen flex flex-col bg-arcade-dark text-arcade-light relative overflow-hidden';

  // ----- INÍCIO DO CÓDIGO DA MESA DE FUNDO/JOGO -----
  const backgroundTableContainer = document.createElement('div');
  backgroundTableContainer.id = 'game-table-area';
  backgroundTableContainer.className = 'absolute inset-0 flex items-center justify-center transition-all duration-500 ease-in-out opacity-30 blur-sm'; 
  
  const rightColumn = document.createElement('div');
  rightColumn.className = 'relative'; 
  
  const tableContainer = document.createElement('div');
  tableContainer.className = 'aspect-[16/10] w-[90vw] max-w-5xl h-auto max-h-[80vh] relative'; 
  
  const pingPongTableElement = document.createElement('div'); 
  pingPongTableElement.id = 'ping-pong-table-visual';
  pingPongTableElement.className = 'absolute inset-0 bg-arcade-darkPurple rounded-lg border-4 border-neon-blue overflow-hidden';
  
  const tableNet = document.createElement('div');
  tableNet.className = 'absolute inset-0 flex items-center justify-center pointer-events-none'; 
  const net = document.createElement('div');
  net.className = 'h-full w-1 bg-neon-blue opacity-80';
  tableNet.appendChild(net);
  
  pingPongTableElement.appendChild(tableNet); 
  
  const glowEffect1 = document.createElement('div');
  glowEffect1.className = 'absolute -inset-2 bg-neon-blue opacity-10 blur-xl rounded-lg pointer-events-none';
  const glowEffect2 = document.createElement('div');
  glowEffect2.className = 'absolute -inset-1 bg-neon-purple opacity-10 blur-md rounded-lg pointer-events-none';
  
  tableContainer.appendChild(glowEffect1);
  tableContainer.appendChild(glowEffect2);
  tableContainer.appendChild(pingPongTableElement);
  rightColumn.appendChild(tableContainer);
  backgroundTableContainer.appendChild(rightColumn);
  // ----- FIM DO CÓDIGO DA MESA DE FUNDO/JOGO -----

  const canvas = document.createElement('canvas');
  canvas.id = 'pong-game-canvas';
  canvas.className = 'absolute rounded-lg pointer-events-none'; 
  canvas.style.display = 'none'; 
  canvas.width = 800; 
  canvas.height = 600; 
  const context = canvas.getContext('2d');
  if (!context) console.error('Failed to get 2D context for game canvas');

  const mainContent = document.createElement('main');
  mainContent.className = 'flex-grow flex flex-col items-center justify-center container mx-auto px-2 py-4 sm:px-4 sm:py-8 z-10 relative';

  const matchmakingContainer = document.createElement('div');
  matchmakingContainer.id = 'matchmaking-ui';
  matchmakingContainer.className = 'flex flex-col items-center justify-center p-8 bg-arcade-darker rounded-lg shadow-xl border-2 border-neon-purple w-full max-w-md';

  const title = document.createElement('h2');
  title.className = 'text-3xl text-neon-pink mb-6 animate-glow';
  title.textContent = 'Pong Ping'; 

  const findMatchButton = document.createElement('button');
  findMatchButton.id = 'find-match-button';
  findMatchButton.textContent = 'Buscar Partida';
  findMatchButton.className = 'px-8 py-3 bg-neon-green text-arcade-darker text-xl font-bold rounded hover:bg-neon-blue hover:text-white transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-neon-pink focus:ring-opacity-50 animate-pulse-neon';

  const matchStatusDisplay = document.createElement('div');
  matchStatusDisplay.id = 'match-status-display';
  matchStatusDisplay.className = 'text-lg text-neon-blue mt-6 h-12 flex items-center justify-center text-center';
  matchStatusDisplay.textContent = '';

  matchmakingContainer.appendChild(title);
  matchmakingContainer.appendChild(findMatchButton);
  matchmakingContainer.appendChild(matchStatusDisplay);

  const scoreDisplay = document.createElement('div');
  scoreDisplay.id = 'game-score-display';
  scoreDisplay.className = 'text-4xl sm:text-5xl font-bold text-neon-blue py-2 px-6 bg-black bg-opacity-70 rounded-lg shadow-lg border-2 border-neon-purple'; 
  scoreDisplay.textContent = 'P1: 0 - P2: 0';
  scoreDisplay.style.display = 'none';

  const gameStatusDisplay = document.createElement('div');
  gameStatusDisplay.id = 'game-overall-status';
  gameStatusDisplay.className = 'font-bold text-xl md:text-2xl text-green neon-text'; 
  gameStatusDisplay.style.display = 'none';

  // Adicionar elementos de matchmaking e status do jogo ao mainContent
  // O placar será adicionado separadamente em renderGamePage
  mainContent.appendChild(matchmakingContainer);
  mainContent.appendChild(gameStatusDisplay);  

  return { 
    pageContainer, 
    mainContent, 
    backgroundTableContainer,
    pingPongTableElement, 
    scoreDisplay, 
    gameStatusDisplay,
    canvas, 
    context,
    matchmakingContainer,
    findMatchButton,
    matchStatusDisplay
  };
}

export interface GameState {
  ball: { x: number; y: number; radius: number };
  paddle1: { x: number; y: number; width: number; height: number };
  paddle2: { x: number; y: number; width: number; height: number };
  score1: number;
  score2: number;
  canvasDimensions?: { width: number; height: number };
}

const PADDLE_COLOR = '#39FF14'; 
const PADDLE_COLOR_P2 = '#D946EF'; 
const BALL_COLOR = '#FFA500';   

export function drawGame(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  gameState: GameState
): void {
  const canvasWidth = gameState.canvasDimensions?.width || canvas.width;
  const canvasHeight = gameState.canvasDimensions?.height || canvas.height;

  if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
  }

  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  ctx.fillStyle = PADDLE_COLOR; 
  const p1 = gameState.paddle1;
  ctx.fillRect(
    p1.x * canvasWidth - (p1.width * canvasWidth) / 2,
    p1.y * canvasHeight - (p1.height * canvasHeight) / 2,
    p1.width * canvasWidth,
    p1.height * canvasHeight
  );

  ctx.fillStyle = PADDLE_COLOR_P2;
  const p2 = gameState.paddle2;
  ctx.fillRect(
    p2.x * canvasWidth - (p2.width * canvasWidth) / 2,
    p2.y * canvasHeight - (p2.height * canvasHeight) / 2,
    p2.width * canvasWidth,
    p2.height * canvasHeight
  );

  ctx.fillStyle = BALL_COLOR;
  ctx.beginPath();
  ctx.arc(
    gameState.ball.x * canvasWidth,
    gameState.ball.y * canvasHeight,
    gameState.ball.radius * Math.min(canvasWidth, canvasHeight), 
    0,
    Math.PI * 2
  );
  ctx.fill();
}