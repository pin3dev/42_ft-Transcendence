// src/services/UserStatusSocket.ts

/**
 * Helper para obter o token de autenticação do localStorage.
 */
function getAuthToken(): string | null {
  // Usa os mesmos nomes de chave que o resto da aplicação
  return localStorage.getItem('userToken') || localStorage.getItem('accessToken');
}

/**
 * Helper para obter o user_id do localStorage.
 */
function getUserId(): string | null {
  return localStorage.getItem('user_id');
}

/**
 * Classe para gerenciar a conexão WebSocket de status do usuário.
 * Implementada como um singleton para garantir uma única conexão por sessão.
 */
class UserStatusSocketManager {
  private ws: WebSocket | null = null;
  private isConnected: boolean = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectTimer: number | null = null;
  private isManualDisconnect = false;

  /**
   * Inicia a conexão com o servidor WebSocket de status.
   */
  public connect(): void {
    // Evita múltiplas conexões
    if (this.isConnected || this.ws) {
      //console.logog('Socket de status já está conectado ou em processo de conexão.');
      return;
    }

    const token = getAuthToken();
    const userId = getUserId();
    
    if (!token || !userId) {
      console.error('Token de autenticação ou user_id não encontrado. Não é possível conectar o socket de status.');
      return;
    }

    // Usa o mesmo endpoint do jogo existente (mesmo servidor)
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.hostname}:3001`;

    //console.logog(`🔌 Conectando ao socket de status em: ${wsUrl}`);
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.isManualDisconnect = false;
      //console.logog('✅ Socket de status de usuário conectado.');

      // Usa a mesma mensagem de autenticação do jogo existente
      this.sendMessage({
        type: 'AUTHENTICATION_LOGIN',
        value: { userToken: token, userId: userId }
      });
    };

    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        //console.logog('📬 Mensagem de status recebida:', message);
        this.handleServerMessage(message);
      } catch (error) {
        console.error('Erro ao processar mensagem do socket de status:', error);
      }
    };

    this.ws.onclose = (event) => {
      //console.logog('❌ Socket de status de usuário desconectado.', event.code, event.reason);
      this.cleanup();

      // Dispara evento customizado
      document.dispatchEvent(new CustomEvent('userStatusDisconnected'));

      // Reconexão automática apenas se não foi desconexão manual
      if (!this.isManualDisconnect && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        const delay = Math.pow(2, this.reconnectAttempts) * 1000;
        //console.logog(`🔄 Tentando reconectar em ${delay / 1000}s... (Tentativa ${this.reconnectAttempts})`);
        
        this.reconnectTimer = window.setTimeout(() => this.connect(), delay);
      } else if (!this.isManualDisconnect) {
        console.error('❌ Máximo de tentativas de reconexão atingido.');
      }
    };

    this.ws.onerror = (error) => {
      console.error('🚨 Erro no socket de status de usuário:', error);
    };
  }

  /**
   * Desconecta o WebSocket de forma limpa.
   */
  public disconnect(): void {
    //console.logog('🔌 Desconectando socket de status...');
    this.isManualDisconnect = true;
    this.cleanup();
    
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      // Envia logout antes de fechar (usando o mesmo formato do jogo)
      this.sendMessage({ type: 'AUTHENTICATION_LOGOUT' });
      this.ws.close(1000, 'Manual disconnect');
    }
  }

  /**
   * Limpa timers e estados internos
   */
  private cleanup(): void {
    this.isConnected = false;
    this.ws = null;
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  /**
   * Roteia as mensagens recebidas para as funções apropriadas.
   */
  private handleServerMessage(message: { type: string; value?: any }): void {
    switch (message.type) {
      case 'OK_USER_AUTHENTICATED':
        //console.logog('✅ Autenticação no socket de status bem-sucedida.');
        // Dispara evento para informar que está online
        document.dispatchEvent(new CustomEvent('userStatusConnected'));
        break;

      case 'FRIEND_STATUS_UPDATE':
        //console.logog(`👥 Amigo ${message.value?.userId} agora está ${message.value?.status}`);
        // Dispara evento para atualizar UI da lista de amigos
        document.dispatchEvent(new CustomEvent('friendStatusUpdate', { 
          detail: message.value 
        }));
        break;

      case 'INCOMING_GAME_INVITE':
        //console.logog(`🎮 Convite para jogar de ${message.value?.from}`);
        // Dispara evento para mostrar notificação de convite
        document.dispatchEvent(new CustomEvent('gameInviteReceived', { 
          detail: message.value 
        }));
        break;

      case 'ERROR_INVALID_CREDENTIALS':
        console.error('❌ Credenciais inválidas no socket de status');
        this.disconnect();
        break;

      default:
        console.warn('⚠️ Tipo de mensagem de status não tratada:', message.type);
    }
  }

  /**
   * Envia uma mensagem para o servidor no formato JSON.
   */
  public sendMessage(data: object): void {
    if (this.ws && this.isConnected && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    } else {
      console.warn('⚠️ Tentativa de enviar mensagem com socket de status não conectado.');
    }
  }

  /**
   * Verifica se o socket está conectado
   */
  public isSocketConnected(): boolean {
    return this.isConnected && this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * Força uma nova tentativa de conexão
   */
  public forceReconnect(): void {
    this.disconnect();
    setTimeout(() => this.connect(), 1000);
  }
}

// Exporta uma única instância (padrão Singleton)
export const userStatusSocket = new UserStatusSocketManager();