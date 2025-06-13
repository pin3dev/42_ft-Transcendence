import './css/style.css';
import { initializeRouter } from './router/index';
import { validateAndCleanAuthState, hasJWTCookie, hasLocalToken, setupAuthStateListeners } from './utils/auth';

// Inicializar o roteador quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🚀 Iniciando aplicação...');
  
  // Valida e limpa o estado de autenticação antes de inicializar o roteador
  await validateAndCleanAuthState();
  
  // Configura listeners para mudanças de estado de autenticação
  setupAuthStateListeners();
  
  // Inicializa o roteador após validar a autenticação
  initializeRouter();
  
  // Configura verificação periódica de autenticação (a cada 5 minutos)
  setInterval(async () => {
    // Só verifica se o usuário aparenta estar logado
    if (hasJWTCookie() || hasLocalToken()) {
      console.log('🔍 Verificação periódica de autenticação...');
      
      const isValid = await validateAndCleanAuthState();
      
      if (!isValid) {
        console.log('❌ Sessão expirou - recarregando página');
        // Se a sessão expirou, recarrega a página para resetar o estado
        window.location.reload();
      }
    }
  }, 5 * 60 * 1000); // 5 minutos
  
  console.log('✅ Aplicação inicializada');
});