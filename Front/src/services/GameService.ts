/*// src/services/GameService.ts
import { GameState } from '../components/GameUI';

// Define message types for better type safety
interface BaseMessage {
  type: string;
  payload?: any;
}

interface PlayerInputMessage extends BaseMessage {
  type: "PLAYER_INPUT";
  payload: {
    action: "MOVE_UP" | "MOVE_DOWN" | "STOP_UP" | "STOP_DOWN"; // Example actions
    // If sending raw keys: key: string; state: "PRESS" | "RELEASE"
  };
}

interface GameStateMessage extends BaseMessage {
  type: "GAME_STATE";
  payload: GameState;
}

interface GameEventMessage extends BaseMessage {
  type: "GAME_EVENT";
  payload: {
    event: string; // e.g., "WAITING_FOR_OPPONENT", "GAME_START", "GAME_OVER"
    message?: string;
    winner?: "player1" | "player2" | "draw";
  };
}

interface AssignPlayerMessage extends BaseMessage {
    type: "ASSIGN_PLAYER";
    payload: {
        player: "player1" | "player2"; // Which paddle this client controls
    };
}

interface ErrorMessage extends BaseMessage {
  type: "ERROR";
  payload: {
    message: string;
  };
}

type ServerMessage = GameStateMessage | GameEventMessage | AssignPlayerMessage | ErrorMessage;


export type GameServiceCallbacks = {
  onOpen?: () => void;
  onClose?: (event: CloseEvent) => void;
  onGameStateUpdate?: (gameState: GameState) => void;
  onGameEvent?: (eventData: GameEventMessage['payload']) => void;
  onAssignPlayer?: (playerData: AssignPlayerMessage['payload']) => void;
  onError?: (errorMessage: string) => void;
  onStatusUpdate?: (status: string) => void; // For general status messages
};

export class GameService {
  private socket: WebSocket | null = null;
  private readonly gameUrl: string;
  private callbacks: GameServiceCallbacks;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000; // 1 second

  constructor(gameUrl: string, callbacks: GameServiceCallbacks) {
    this.gameUrl = gameUrl;
    this.callbacks = callbacks;
  }

  connect(): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      console.log('WebSocket already connected.');
      return;
    }
    
    this.callbacks.onStatusUpdate?.('Connecting to game server...');
    this.socket = new WebSocket(this.gameUrl);

    this.socket.onopen = () => {
      console.log('WebSocket connection established.');
      this.reconnectAttempts = 0; // Reset on successful connection
      this.callbacks.onOpen?.();
      this.callbacks.onStatusUpdate?.('Connection successful! Waiting for game...');
    };

    this.socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data as string) as ServerMessage;
        switch (message.type) {
          case 'GAME_STATE':
            this.callbacks.onGameStateUpdate?.(message.payload);
            break;
          case 'GAME_EVENT':
            this.callbacks.onGameEvent?.(message.payload);
            break;
          case 'ASSIGN_PLAYER':
            this.callbacks.onAssignPlayer?.(message.payload);
            break;
          case 'ERROR':
            this.callbacks.onError?.(message.payload.message);
            break;
          default:
            console.warn('Received unknown message type:', message);
        }
      } catch (error) {
        console.error('Failed to parse message or handle event:', error);
        this.callbacks.onError?.('Received malformed data from server.');
      }
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.callbacks.onError?.('WebSocket connection error.');
      // onclose will handle reconnection logic
    };

    this.socket.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      this.callbacks.onClose?.(event);
      if (event.wasClean) {
        this.callbacks.onStatusUpdate?.('Disconnected from server.');
      } else {
        // Attempt to reconnect if not a clean close and within attempt limits
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts -1); // Exponential backoff
          this.callbacks.onStatusUpdate?.(`Connection lost. Attempting to reconnect in ${delay / 1000}s... (Attempt ${this.reconnectAttempts})`);
          setTimeout(() => this.connect(), delay);
        } else {
          this.callbacks.onStatusUpdate?.('Could not reconnect to server. Please refresh.');
          this.callbacks.onError?.('Failed to reconnect after multiple attempts.');
        }
      }
    };
  }

  sendInput(action: PlayerInputMessage['payload']['action']): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      const message: PlayerInputMessage = {
        type: 'PLAYER_INPUT',
        payload: { action },
      };
      this.socket.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected. Cannot send input.');
      this.callbacks.onError?.('Not connected to server. Cannot send input.');
    }
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close(1000, "Client initiated disconnect"); // 1000 is normal closure
      this.socket = null;
      console.log('WebSocket connection closed by client.');
    }
  }
} */


// src/services/GameService.ts (NOVO MOCK COMPLETO)

import { GameState } from '../components/GameUI'; // Supondo que GameUI.ts define GameState

// --- INTERFACES DE MENSAGEM (mantidas para clareza, mesmo que o mock não use todas) ---
interface BaseMessage { type: string; payload?: any; }

interface PlayerInputMessage extends BaseMessage {
  type: "PLAYER_INPUT";
  payload: { action: "MOVE_UP" | "MOVE_DOWN" | "STOP_UP" | "STOP_DOWN"; };
}

// (GameStateMessage, GameEventMessage, AssignPlayerMessage, ErrorMessage como antes)
// ... se você as tiver definido em outro lugar, pode remover daqui.
// Por ora, vou mantê-las para o contexto do GameService.

interface GameStateMessage extends BaseMessage {
  type: "GAME_STATE";
  payload: GameState;
}

interface MatchmakingEventMessage extends BaseMessage {
  type: "MATCHMAKING_EVENT";
  payload: {
    event: "SEARCHING" | "MATCH_FOUND" | "WAITING_FOR_OPPONENT_ACCEPT" | "OPPONENT_DECLINED" | "MATCH_ACCEPTED_STARTING" | "QUEUE_UPDATE";
    message: string;
    queuePosition?: number;
    estimatedWaitTime?: number;
  };
}

interface GameEventMessage extends BaseMessage {
  type: "GAME_EVENT";
  payload: {
    event: "GAME_START" | "GAME_OVER" | "COUNTDOWN";
    message?: string;
    winner?: "player1" | "player2" | "draw";
    countdownValue?: number;
  };
}

interface AssignPlayerMessage extends BaseMessage {
    type: "ASSIGN_PLAYER";
    payload: { player: "player1" | "player2"; };
}

// --- TIPOS DE CALLBACKS ---
export type GameServiceCallbacks = {
  onOpen?: () => void;
  onClose?: (event: CloseEvent) // Usando CloseEvent global
    => void;
  onGameStateUpdate?: (gameState: GameState) => void;
  onGameEvent?: (eventData: GameEventMessage['payload']) => void;
  onMatchmakingEvent?: (eventData: MatchmakingEventMessage['payload']) => void;
  onAssignPlayer?: (playerData: AssignPlayerMessage['payload']) => void;
  onError?: (errorMessage: string) => void;
  onStatusUpdate?: (status: string) => void;
};

// --- CLASSE GameService MOCKADA ---
export class GameService {
  private callbacks: GameServiceCallbacks;
  private mockGameState: GameState;
  private assignedPlayer: "player1" | "player2" = "player1"; // O jogador que este cliente controla

  private paddleSpeed = 0.03; // Velocidade de movimento do paddle
  private ballSpeedX = 0.007; // Velocidade horizontal da bola (ajuste para dificuldade)
  private ballSpeedY = 0.005; // Velocidade vertical da bola

  private gameLoopIntervalId: number | null = null;
  private matchmakingTimeoutId: number | null = null;
  private countdownIntervalId: number | null = null;

  private readonly MAX_SCORE = 5; // Pontuação para vencer

  constructor(gameUrl: string, callbacks: GameServiceCallbacks) {
    console.log("MOCK GameService: Constructor called. Game URL (ignored):", gameUrl);
    this.callbacks = callbacks;
    this.mockGameState = this.getInitialGameState();
  }

  private getInitialGameState(): GameState {
    return {
      ball: { x: 0.5, y: 0.5, radius: 0.015 }, // Bola no centro
      paddle1: { x: 0.05, y: 0.5, width: 0.02, height: 0.15 }, // Paddle esquerdo
      paddle2: { x: 0.95, y: 0.5, width: 0.02, height: 0.15 }, // Paddle direito
      score1: 0,
      score2: 0,
      canvasDimensions: { width: 800, height: 600 } // Dimensões lógicas do jogo
    };
  }

  private resetBall(): void {
    this.mockGameState.ball.x = 0.5;
    this.mockGameState.ball.y = 0.5;
    // Inverter direção X após um ponto para variar o serviço
    this.ballSpeedX *= (Math.random() > 0.3 ? -1 : 1); // Mais chance de inverter
    this.ballSpeedY = (Math.random() - 0.5) * 0.01; // Nova direção Y aleatória leve
    if (Math.abs(this.ballSpeedY) < 0.002) this.ballSpeedY = (this.ballSpeedY > 0 ? 1: -1) * 0.003; // Garante Y mínimo
  }

  // Conexão simulada do WebSocket
  connect(): void {
    console.log("MOCK GameService: connect() - Simulating WebSocket connection...");
    this.callbacks.onStatusUpdate?.('Mock Service: Connecting to server...');
    setTimeout(() => {
      console.log("MOCK GameService: connect() - Simulated OPEN.");
      this.callbacks.onOpen?.();
      this.callbacks.onStatusUpdate?.('Mock Service: Connection established.');
    }, 300); // Pequeno delay para simular conexão
  }

  // Lógica de Matchmaking
  findMatch(): void {
    console.log("MOCK GameService: findMatch() - Starting matchmaking simulation.");
    this.clearAllTimeoutsAndIntervals(); // Limpa timers anteriores
    this.callbacks.onMatchmakingEvent?.({ event: "SEARCHING", message: "Buscando partida..." });
    
    this.matchmakingTimeoutId = window.setTimeout(() => {
      console.log("MOCK GameService: findMatch() - Match found (simulated).");
      this.callbacks.onMatchmakingEvent?.({ 
        event: "MATCH_FOUND", 
        message: "Partida encontrada! Aceite para jogar." 
      });
    }, 2000); // Simula encontrar partida após 2 segundos
  }

  acceptMatch(): void {
    console.log("MOCK GameService: acceptMatch() - Player accepted match.");
    this.clearAllTimeoutsAndIntervals();
    this.callbacks.onMatchmakingEvent?.({ event: "WAITING_FOR_OPPONENT_ACCEPT", message: "Aguardando oponente aceitar..." });

    this.matchmakingTimeoutId = window.setTimeout(() => {
      console.log("MOCK GameService: acceptMatch() - Opponent accepted (simulated). Starting countdown.");
      this.callbacks.onMatchmakingEvent?.({
          event: "MATCH_ACCEPTED_STARTING",
          message: "Ambos aceitaram! Iniciando jogo..."
      });
      // Atribuir o jogador (poderia ser aleatório ou fixo para teste)
      this.assignedPlayer = Math.random() > 0.5 ? "player1" : "player2";
      this.callbacks.onAssignPlayer?.({ player: this.assignedPlayer }); 
      console.log(`MOCK GameService: Assigned player as ${this.assignedPlayer}`);

      this.startCountdown();
    }, 1500); // Simula oponente aceitando
  }

  declineMatch(): void { // Se você adicionar um botão de recusar
    console.log("MOCK GameService: declineMatch() - Player declined.");
    this.clearAllTimeoutsAndIntervals();
    this.callbacks.onMatchmakingEvent?.({ event: "SEARCHING", message: "Você recusou. Buscando nova partida..." });
    this.findMatch(); // Reinicia a busca
  }

  private startCountdown(): void {
    let countdown = 3;
    this.countdownIntervalId = window.setInterval(() => {
      console.log(`MOCK GameService: Countdown: ${countdown}`);
      this.callbacks.onGameEvent?.({ event: "COUNTDOWN", countdownValue: countdown, message: `Jogo começando em ${countdown}...`});
      countdown--;
      if (countdown < 0) {
        if (this.countdownIntervalId) clearInterval(this.countdownIntervalId);
        this.countdownIntervalId = null;
        console.log("MOCK GameService: Countdown finished. Emitting GAME_START and starting game loop.");
        this.callbacks.onGameEvent?.({ event: "GAME_START", message: "GO!" });
        this.startGameLoop();
      }
    }, 1000);
  }

  // Loop principal do jogo mockado
  private startGameLoop(): void {
    console.log("MOCK GameService: startGameLoop() - Initializing game state for new game.");
    this.mockGameState = this.getInitialGameState(); // Reseta estado para novo jogo
    this.resetBall(); // Define velocidades iniciais da bola

    if (this.gameLoopIntervalId) clearInterval(this.gameLoopIntervalId); // Limpa loop anterior se houver

    this.gameLoopIntervalId = window.setInterval(() => {
      // 1. Mover a bola
      this.mockGameState.ball.x += this.ballSpeedX;
      this.mockGameState.ball.y += this.ballSpeedY;

      // 2. Colisão da bola com paredes superior/inferior
      const ballRadius = this.mockGameState.ball.radius;
      if (this.mockGameState.ball.y - ballRadius < 0) { // Topo
        this.mockGameState.ball.y = ballRadius;
        this.ballSpeedY *= -1;
      } else if (this.mockGameState.ball.y + ballRadius > 1) { // Fundo
        this.mockGameState.ball.y = 1 - ballRadius;
        this.ballSpeedY *= -1;
      }

      // 3. Colisão da bola com as raquetes (simplificado)
      const p1 = this.mockGameState.paddle1;
      const p2 = this.mockGameState.paddle2;

      // Colisão com paddle1 (esquerdo)
      if (this.ballSpeedX < 0 && // Bola movendo para a esquerda
          this.mockGameState.ball.x - ballRadius < p1.x + p1.width / 2 &&
          this.mockGameState.ball.x + ballRadius > p1.x - p1.width / 2 &&
          this.mockGameState.ball.y > p1.y - p1.height / 2 &&
          this.mockGameState.ball.y < p1.y + p1.height / 2) {
        this.mockGameState.ball.x = p1.x + p1.width / 2 + ballRadius; // Empurra para fora
        this.ballSpeedX *= -1;
        // Ângulo de rebatida (opcional, mais complexo)
        // let deltaY = this.mockGameState.ball.y - p1.y;
        // this.ballSpeedY = deltaY * 0.15;
      }

      // Colisão com paddle2 (direito)
      if (this.ballSpeedX > 0 && // Bola movendo para a direita
          this.mockGameState.ball.x + ballRadius > p2.x - p2.width / 2 &&
          this.mockGameState.ball.x - ballRadius < p2.x + p2.width / 2 &&
          this.mockGameState.ball.y > p2.y - p2.height / 2 &&
          this.mockGameState.ball.y < p2.y + p2.height / 2) {
        this.mockGameState.ball.x = p2.x - p2.width / 2 - ballRadius; // Empurra para fora
        this.ballSpeedX *= -1;
        // let deltaY = this.mockGameState.ball.y - p2.y;
        // this.ballSpeedY = deltaY * 0.15;
      }
      
      // 4. Lógica de Pontuação
      let scored = false;
      if (this.mockGameState.ball.x - ballRadius < 0) { // Ponto para P2
        this.mockGameState.score2++;
        console.log(`MOCK GameService: P2 Scored! Score: ${this.mockGameState.score1}-${this.mockGameState.score2}`);
        scored = true;
      } else if (this.mockGameState.ball.x + ballRadius > 1) { // Ponto para P1
        this.mockGameState.score1++;
        console.log(`MOCK GameService: P1 Scored! Score: ${this.mockGameState.score1}-${this.mockGameState.score2}`);
        scored = true;
      }

      if (scored) {
        if (this.mockGameState.score1 >= this.MAX_SCORE || this.mockGameState.score2 >= this.MAX_SCORE) {
          console.log("MOCK GameService: Game Over.");
          this.callbacks.onGameEvent?.({
              event: "GAME_OVER",
              message: "Fim de Jogo!",
              winner: this.mockGameState.score1 >= this.MAX_SCORE ? "player1" : "player2"
          });
          this.disconnectGameLoop(); // Para o loop do jogo, mas não a "conexão"
          return; // Sai do setInterval callback
        } else {
          this.resetBall(); // Reseta a bola para o próximo ponto
        }
      }
      
      // 5. Enviar atualização de estado
      // console.log("MOCK GameService: Tick - Updating state:", JSON.parse(JSON.stringify(this.mockGameState)));
      this.callbacks.onGameStateUpdate?.({ ...this.mockGameState });
    }, 16); // Aproximadamente 60 FPS (1000ms / 60fps ~= 16.6ms)
  }

  // Manipulação de input do jogador
  sendInput(action: PlayerInputMessage['payload']['action']): void {
    // console.log(`MOCK GameService: Received input: ${action} for player ${this.assignedPlayer}`);
    const paddleToMove = this.assignedPlayer === "player1" ? this.mockGameState.paddle1 : this.mockGameState.paddle2;
    
    // Para input contínuo, precisaríamos de keydown/keyup e um loop de input
    // Para este mock, vamos mover diretamente. O backend real lidaria com isso melhor.
    if (action === 'MOVE_UP') {
      paddleToMove.y -= this.paddleSpeed;
    } else if (action === 'MOVE_DOWN') {
      paddleToMove.y += this.paddleSpeed;
    }
    // STOP_UP e STOP_DOWN são ignorados neste mock simples. O backend precisaria de lógica de estado para isso.

    // Manter paddles dentro dos limites (y é o centro do paddle)
    const paddleHalfHeight = paddleToMove.height / 2;
    paddleToMove.y = Math.max(paddleHalfHeight, Math.min(1 - paddleHalfHeight, paddleToMove.y));
    
    // Não precisa chamar onGameStateUpdate aqui, o loop principal já faz isso.
  }

  private clearAllTimeoutsAndIntervals(): void {
    if (this.matchmakingTimeoutId) clearTimeout(this.matchmakingTimeoutId);
    if (this.countdownIntervalId) clearInterval(this.countdownIntervalId);
    // Não limpamos o gameLoopIntervalId aqui, pois ele é gerenciado separadamente
    this.matchmakingTimeoutId = null;
    this.countdownIntervalId = null;
  }
  
  private disconnectGameLoop(): void {
      if (this.gameLoopIntervalId) {
          clearInterval(this.gameLoopIntervalId);
          this.gameLoopIntervalId = null;
          console.log("MOCK GameService: Game loop stopped.");
      }
  }

  // Desconexão simulada
  disconnect(): void { // Chamado pela UI ou ao final do jogo
    console.log("MOCK GameService: disconnect() - Simulating WebSocket close.");
    this.clearAllTimeoutsAndIntervals();
    this.disconnectGameLoop();

    // Simular evento de desconexão (CloseEvent é uma interface global)
    const mockCloseEvent: CloseEventInit = {
        code: 1000,
        reason: 'Mock client initiated disconnect',
        wasClean: true
    };
    this.callbacks.onClose?.(new CloseEvent('mockclose', mockCloseEvent));
    this.callbacks.onStatusUpdate?.('Mock Service: Disconnected.');
  }
}