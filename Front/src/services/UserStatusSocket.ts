// src/services/UserStatusSocket.ts

/**
 * Helper para obter o token de autenticação do localStorage.
 * Assumindo que seu 'fetchWithAuth' o armazena lá.
 */
function getAuthToken(): string | null {
    // ATENÇÃO: Ajuste 'accessToken' para o nome da chave que você realmente usa.
    return localStorage.getItem('accessToken');
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
  
    /**
     * Inicia a conexão com o servidor WebSocket.
     */
    public connect(): void {
      // Evita múltiplas conexões
      if (this.isConnected || this.ws) {
        console.log('Socket de status já está conectado ou em processo de conexão.');
        return;
      }
  
      const token = getAuthToken();
      if (!token) {
        console.error('Token de autenticação não encontrado. Não é possível conectar o socket de status.');
        return;
      }
  
      // Usa o mesmo hostname e porta do jogo, mas poderia ser um serviço diferente.
      // Usa wss:// para conexões seguras (https)
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.hostname}:3001`;
  
      console.log(`Tentando conectar ao socket de status em: ${wsUrl}`);
      this.ws = new WebSocket(wsUrl);
  
      this.ws.onopen = () => {
        this.isConnected = true;
        this.reconnectAttempts = 0; // Reseta tentativas de reconexão
        console.log('✅ Socket de status de usuário conectado.');
  
        // Envia a mensagem de autenticação, similar ao jogo
        this.sendMessage({
          type: 'AUTHENTICATION_MAKE',
          value: { userToken: token },
        });
      };
  
      this.ws.onmessage = (event) => {
        const message = JSON.parse(event.data);
        console.log('📬 Mensagem de status recebida:', message);
  
        // Aqui você tratará as atualizações em tempo real
        this.handleServerMessage(message);
      };
  
      this.ws.onclose = () => {
        console.log('❌ Socket de status de usuário desconectado.');
        this.isConnected = false;
        this.ws = null;
  
        // Lógica de reconexão automática (opcional, mas recomendado)
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = Math.pow(2, this.reconnectAttempts) * 1000;
          console.log(`Tentando reconectar em ${delay / 1000}s...`);
          setTimeout(() => this.connect(), delay);
        } else {
          console.error('Máximo de tentativas de reconexão atingido.');
        }
      };
  
      this.ws.onerror = (error) => {
        console.error('🚨 Erro no socket de status de usuário:', error);
        // O onclose será chamado logo em seguida, tratando a reconexão.
      };
    }
  
    /**
     * Desconecta o WebSocket de forma limpa.
     */
    public disconnect(): void {
      if (this.ws) {
        this.maxReconnectAttempts = 0; // Impede a reconexão ao desconectar manualmente
        this.ws.close();
        console.log('Socket de status desconectado manualmente.');
      }
    }
  
    /**
     * Roteia as mensagens recebidas para as funções apropriadas.
     */
    private handleServerMessage(message: { type: string; value: any }): void {
      switch (message.type) {
        case 'OK_USER_AUTHENTICATED':
          console.log('Autenticação no socket de status bem-sucedida.');
          break;
  
        case 'FRIEND_STATUS_UPDATE':
          console.log(`Amigo ${message.value.userId} agora está ${message.value.status}`);
          // TODO: Disparar um evento customizado ou chamar um callback para atualizar a UI da lista de amigos.
          // Ex: document.dispatchEvent(new CustomEvent('friendStatusUpdate', { detail: message.value }));
          break;
  
        case 'INCOMING_GAME_INVITE':
          console.log(`Você recebeu um convite para jogar de ${message.value.from}`);
          // TODO: Mostrar um modal/notificação para o usuário aceitar ou recusar o convite.
          break;
  
        default:
          console.warn('Tipo de mensagem de status não tratada:', message.type);
      }
    }
  
    /**
     * Envia uma mensagem para o servidor no formato JSON.
     */
    public sendMessage(data: object): void {
      if (this.ws && this.isConnected) {
        this.ws.send(JSON.stringify(data));
      } else {
        console.warn('Tentativa de enviar mensagem com socket de status não conectado.');
      }
    }
  }
  
  // Exporta uma única instância (padrão Singleton) para ser usada em toda a aplicação.
  export const userStatusSocket = new UserStatusSocketManager();