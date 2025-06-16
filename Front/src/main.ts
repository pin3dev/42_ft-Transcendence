import './css/style.css';
import { initializeRouter } from './router/index';
import { validateAndCleanAuthState, hasJWTCookie, hasLocalToken, setupAuthStateListeners } from './utils/auth';
import { userStatusSocket } from './services/UserStatusSocket';

/**
 * Inicializa o socket de status se o usuário estiver autenticado
 */
async function initializeUserStatusIfAuthenticated(): Promise<void> {
  const hasToken = hasJWTCookie() || hasLocalToken();
  const hasUserId = localStorage.getItem('user_id');
  
  if (hasToken && hasUserId) {
    //console.log('🔄 Usuário autenticado encontrado - inicializando socket de status');
    
    try {
      // Verifica se a sessão ainda é válida
      const isValid = await validateAndCleanAuthState();
      
      if (isValid) {
        // Inicializa o socket de status
        userStatusSocket.connect();
        
        // Configura cleanup quando a página for fechada
        window.addEventListener('beforeunload', () => {
          userStatusSocket.disconnect();
        });
        
        // Configura cleanup para logout
        document.addEventListener('userLoggedOut', () => {
          userStatusSocket.disconnect();
        });
        
      } else {
        //console.log('❌ Sessão expirou - não inicializando socket de status');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação para socket de status:', error);
    }
  } else {
    //console.log('⚠️ Usuário não autenticado - socket de status não inicializado');
  }
}

// Inicializar o roteador quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async () => {
  //console.log('🚀 Iniciando aplicação...');
  
  // Valida e limpa o estado de autenticação antes de inicializar o roteador
  await validateAndCleanAuthState();
  
  // Configura listeners para mudanças de estado de autenticação
  setupAuthStateListeners();
  
  // Inicializa o socket de status se o usuário estiver autenticado
  await initializeUserStatusIfAuthenticated();
  
  // Inicializa o roteador após validar a autenticação
  initializeRouter();
  
  // Configura verificação periódica de autenticação (a cada 5 minutos)
  setInterval(async () => {
    // Só verifica se o usuário aparenta estar logado
    if (hasJWTCookie() || hasLocalToken()) {
      //console.log('🔍 Verificação periódica de autenticação...');
      
      const isValid = await validateAndCleanAuthState();
      
      if (!isValid) {
        //console.log('❌ Sessão expirou - recarregando página');
        // Desconecta socket antes de recarregar
        userStatusSocket.disconnect();
        // Se a sessão expirou, recarrega a página para resetar o estado
        window.location.reload();
      }
    }
  }, 5 * 60 * 1000); // 5 minutos
  
  //console.log('✅ Aplicação inicializada');
});