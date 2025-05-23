// /frontend/src/pages/GamePage.ts
import { createNavbar } from '../components/Navbar';
import { createFooter } from '../components/Footer';
import { 
    createFullGameUI, 
    drawGame, 
    GameState, 
    UIElements
} from '../components/GameUI';
import { GameService, GameServiceCallbacks } from '../services/GameService';

let gameServiceInstance: GameService | null = null;
let keydownListener: ((event: KeyboardEvent) => void) | null = null;
let keyupListener: ((event: KeyboardEvent) => void) | null = null;
let windowResizeListener: (() => void) | null = null; 
let animationFrameId: number | null = null;
let controlledPlayer: "player1" | "player2" | null = null;
let currentGameState: GameState | null = null;
let ui: UIElements | null = null; 
let gameStatusTimeoutId: number | null = null; 

type UIPageState = "IDLE" | "SEARCHING" | "MATCH_FOUND" | "WAITING_FOR_OPPONENT" | "GAME_STARTING" | "IN_GAME" | "GAME_OVER";
let currentUIPageState: UIPageState = "IDLE";

function clearRoot(rootElement: HTMLElement): void {
  while (rootElement.firstChild) {
    rootElement.removeChild(rootElement.firstChild);
  }
}

function cleanupGamePage(): void {
  console.log("Cleaning up GamePage resources...");
  if (gameServiceInstance) gameServiceInstance.disconnect();
  if (keydownListener) document.removeEventListener('keydown', keydownListener);
  if (keyupListener) document.removeEventListener('keyup', keyupListener);
  if (windowResizeListener) window.removeEventListener('resize', windowResizeListener);
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (gameStatusTimeoutId) clearTimeout(gameStatusTimeoutId);
  
  gameServiceInstance = null; keydownListener = null; keyupListener = null; windowResizeListener = null;
  animationFrameId = null; controlledPlayer = null; currentGameState = null; ui = null;
  gameStatusTimeoutId = null;
}

function gameLoop() {
  if (currentUIPageState === "IN_GAME" && ui && ui.context && currentGameState) {
    drawGame(ui.context, ui.canvas, currentGameState);
  }
  animationFrameId = requestAnimationFrame(gameLoop);
}

function positionGameCanvas() {
    if (!ui || !ui.pingPongTableElement || !ui.canvas || !ui.pageContainer) return; // Adicionado ui.pageContainer check

    const tableRect = ui.pingPongTableElement.getBoundingClientRect();
    const pageContainerRect = ui.pageContainer.getBoundingClientRect(); 

    ui.canvas.style.width = `${tableRect.width}px`;
    ui.canvas.style.height = `${tableRect.height}px`;
    ui.canvas.style.position = 'absolute'; 
    ui.canvas.style.left = `${tableRect.left - pageContainerRect.left}px`;
    ui.canvas.style.top = `${tableRect.top - pageContainerRect.top}px`;
    ui.canvas.style.zIndex = '5'; 
}

function updateUIForState(newState: UIPageState): void {
    if (!ui) return;
    currentUIPageState = newState;
    console.log("UI State changed to:", newState);

    if (gameStatusTimeoutId) {
        clearTimeout(gameStatusTimeoutId);
        gameStatusTimeoutId = null;
    }

    ui.matchmakingContainer.style.display = 'none';
    ui.scoreDisplay.style.display = 'none';
    ui.gameStatusDisplay.style.display = 'none';
    ui.canvas.style.display = 'none';
    if (ui.findMatchButton) ui.findMatchButton.style.display = 'none';
    ui.backgroundTableContainer.classList.add('opacity-30', 'blur-sm');
    ui.backgroundTableContainer.classList.remove('opacity-100', 'blur-none');

    const existingAcceptButton = document.getElementById('accept-match-button');
    if (existingAcceptButton) existingAcceptButton.remove();
    const existingPlayAgainButton = document.getElementById('play-again-button');
    if (existingPlayAgainButton) existingPlayAgainButton.remove();

    switch (newState) {
        case "IDLE":
            ui.matchmakingContainer.style.display = 'flex';
            if (ui.findMatchButton) ui.findMatchButton.style.display = 'block';
            ui.matchStatusDisplay.textContent = 'Pronto para jogar?';
            break;
        case "SEARCHING":
            ui.matchmakingContainer.style.display = 'flex';
            ui.matchStatusDisplay.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-neon-green mx-auto mb-2"></div>Buscando partida...';
            break;
        case "MATCH_FOUND":
            ui.matchmakingContainer.style.display = 'flex';
            ui.matchStatusDisplay.textContent = 'Partida encontrada!';
            const acceptButton = document.createElement('button');
            acceptButton.id = 'accept-match-button'; 
            acceptButton.textContent = 'Aceitar';
            acceptButton.className = 'mt-4 px-6 py-2 bg-neon-green text-arcade-darker font-bold rounded hover:bg-opacity-80';
            acceptButton.onclick = () => gameServiceInstance?.acceptMatch();
            ui.matchmakingContainer.appendChild(acceptButton);
            break;
        case "WAITING_FOR_OPPONENT":
            ui.matchmakingContainer.style.display = 'flex';
            ui.matchStatusDisplay.innerHTML = '<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-neon-blue mx-auto mb-2"></div>Aguardando oponente...';
            break;
        case "GAME_STARTING":
            ui.matchmakingContainer.style.display = 'flex'; 
            ui.backgroundTableContainer.classList.remove('opacity-30', 'blur-sm');
            ui.backgroundTableContainer.classList.add('opacity-100', 'blur-none');
            positionGameCanvas(); 
            break;
        case "IN_GAME":
            ui.scoreDisplay.style.display = 'block'; 
            ui.gameStatusDisplay.style.display = 'block'; 
            ui.gameStatusDisplay.textContent = "GO!";
            ui.canvas.style.display = 'block';
            ui.backgroundTableContainer.classList.remove('opacity-30', 'blur-sm');
            ui.backgroundTableContainer.classList.add('opacity-100', 'blur-none');
            positionGameCanvas(); 

            gameStatusTimeoutId = window.setTimeout(() => {
                if (ui && ui.gameStatusDisplay && currentUIPageState === "IN_GAME") { 
                    ui.gameStatusDisplay.textContent = ''; 
                }
            }, 500); 
            break;
        case "GAME_OVER":
            ui.scoreDisplay.style.display = 'block';
            ui.gameStatusDisplay.style.display = 'block'; 
            ui.canvas.style.display = 'block'; 
            ui.backgroundTableContainer.classList.remove('opacity-30', 'blur-sm');
            ui.backgroundTableContainer.classList.add('opacity-100', 'blur-none');
            
            const playAgainButton = document.createElement('button');
            playAgainButton.id = 'play-again-button'; 
            playAgainButton.textContent = 'Jogar Novamente';
            playAgainButton.className = 'mt-4 px-6 py-2 bg-neon-pink text-white font-bold rounded hover:bg-opacity-80';
            playAgainButton.onclick = () => {
                currentGameState = null; 
                if(ui?.scoreDisplay) ui.scoreDisplay.textContent = "P1: 0 - P2: 0";
                updateUIForState("IDLE");
            };
            ui.gameStatusDisplay.insertAdjacentElement('afterend', playAgainButton);
            break;
    }
}

export function renderGamePage(): void {
  const root = document.getElementById('root');
  if (!root) { console.error('Root element not found!'); return; }
  
  cleanupGamePage();
  clearRoot(root);

  ui = createFullGameUI();

  ui.pageContainer.appendChild(createNavbar());

  const scoreContainer = document.createElement('div');
  scoreContainer.className = 'w-full flex justify-center py-4 z-20 relative'; 
  scoreContainer.appendChild(ui.scoreDisplay); 
  ui.pageContainer.appendChild(scoreContainer);

  ui.pageContainer.appendChild(ui.backgroundTableContainer); 
  ui.pageContainer.appendChild(ui.mainContent); 
  ui.pageContainer.appendChild(ui.canvas); 
  ui.pageContainer.appendChild(createFooter());
  root.appendChild(ui.pageContainer);
  
  windowResizeListener = positionGameCanvas;
  window.addEventListener('resize', windowResizeListener);

  const serviceCallbacks: GameServiceCallbacks = {
    onOpen: () => {
        if(ui?.matchStatusDisplay) ui.matchStatusDisplay.textContent = 'Conectado ao servidor.';
        updateUIForState("IDLE");
    },
    onClose: (event) => { 
        if(ui?.matchStatusDisplay) {
            ui.matchStatusDisplay.textContent = `Desconectado: ${event.reason || 'Conexão perdida'}`;
        }
        updateUIForState("IDLE");
    },
    onGameStateUpdate: (gameState) => {
      currentGameState = gameState;
      if (ui && ui.scoreDisplay && ui.canvas) {
         ui.scoreDisplay.textContent = `P1: ${gameState.score1} - P2: ${gameState.score2}`;
         if (gameState.canvasDimensions) { 
            if (ui.canvas.width !== gameState.canvasDimensions.width ||
                ui.canvas.height !== gameState.canvasDimensions.height) {
                ui.canvas.width = gameState.canvasDimensions.width;
                ui.canvas.height = gameState.canvasDimensions.height;
                console.log(`Canvas logical resolution set to: ${ui.canvas.width}x${ui.canvas.height}`);
                positionGameCanvas(); 
            }
         }
      }
    },
    onGameEvent: (eventData) => {
        if (!ui) return;
        if (eventData.event === "COUNTDOWN" && ui.matchStatusDisplay) {
            updateUIForState("GAME_STARTING");
            ui.matchStatusDisplay.textContent = eventData.message || `Iniciando em ${eventData.countdownValue}...`;
        } else if (eventData.event === "GAME_START") {
            updateUIForState("IN_GAME");
        } else if (eventData.event === "GAME_OVER" && ui.gameStatusDisplay) {
            ui.gameStatusDisplay.textContent = `FIM DE JOGO! ${eventData.winner === 'draw' ? 'Empate!' : (eventData.winner?.toUpperCase() + ' VENCEU!')} ${eventData.message || ''}`;
            updateUIForState("GAME_OVER");
        }
    },
    onMatchmakingEvent: (eventData) => { 
        if (!ui || !ui.matchStatusDisplay) return;
        ui.matchStatusDisplay.textContent = eventData.message;
        if (eventData.event === "SEARCHING") {
            updateUIForState("SEARCHING");
        } else if (eventData.event === "MATCH_FOUND") {
            updateUIForState("MATCH_FOUND");
        } else if (eventData.event === "WAITING_FOR_OPPONENT_ACCEPT") {
            updateUIForState("WAITING_FOR_OPPONENT");
        }
    },
    onAssignPlayer: (playerData) => { 
        controlledPlayer = playerData.player;
    },
    onError: (errorMessage) => { 
        if(ui?.matchStatusDisplay) ui.matchStatusDisplay.textContent = `Erro: ${errorMessage}`;
    },
    onStatusUpdate: (status) => { /* console.log("WebSocket Status:", status); */ }
  };

  gameServiceInstance = new GameService('ws://localhost:8080/ws/pong/game/', serviceCallbacks); // Use a URL correta do seu backend
  gameServiceInstance.connect();

  if (ui?.findMatchButton) {
    ui.findMatchButton.onclick = () => gameServiceInstance?.findMatch();
  }

  const pressedKeys = new Set<string>();
  keydownListener = (event: KeyboardEvent) => { 
    if (currentUIPageState !== "IN_GAME" || !gameServiceInstance || !controlledPlayer) return;
    let action: string | null = null;
    switch (event.key.toLowerCase()) {
      case 'w': case 'arrowup': action = 'MOVE_UP'; break;
      case 's': case 'arrowdown': action = 'MOVE_DOWN'; break;
    }
    if (action && !pressedKeys.has(event.key.toLowerCase())) {
      gameServiceInstance.sendInput(action as any);
      pressedKeys.add(event.key.toLowerCase());
      event.preventDefault(); 
    }
  };
  keyupListener = (event: KeyboardEvent) => { 
    if (currentUIPageState !== "IN_GAME" ||!gameServiceInstance || !controlledPlayer) return;
    let action: string | null = null;
    const lowerKey = event.key.toLowerCase();
    if (!pressedKeys.has(lowerKey)) return;
    switch (lowerKey) {
      case 'w': case 'arrowup': action = 'STOP_UP'; break;
      case 's': case 'arrowdown': action = 'STOP_DOWN'; break;
    }
    if (action) {
      gameServiceInstance.sendInput(action as any); 
      pressedKeys.delete(lowerKey);
      event.preventDefault();
    }
  };
  document.addEventListener('keydown', keydownListener);
  document.addEventListener('keyup', keyupListener);

  updateUIForState("IDLE");
  gameLoop();
}