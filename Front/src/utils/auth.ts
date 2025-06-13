import { fetchWithAuth } from './fetchWithAuth';

/**
 * Verifica se o usuário está autenticado fazendo uma requisição para uma rota protegida
 * @returns Promise<boolean> - true se autenticado, false caso contrário
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const response = await fetch('/user/profile', {
      method: 'GET',
      credentials: 'include' // Inclui cookies
    });
    
    return response.ok;
  } catch (error) {
    // Se a requisição falhar (erro de rede, 401, etc.), consideramos não autenticado
    return false;
  }
}

/**
 * Valida a autenticação atual e limpa dados inválidos
 * Esta função deve ser chamada na inicialização do app para garantir consistência
 * @returns Promise<boolean> - true se o usuário estiver realmente autenticado
 */
export async function validateAndCleanAuthState(): Promise<boolean> {
  console.log('🔍 Validando estado de autenticação...');
  
  const hasLocal = hasLocalToken();
  const hasJWT = hasJWTCookie();
  
  console.log('📱 hasLocalToken:', hasLocal);
  console.log('🍪 hasJWTCookie:', hasJWT);
  
  // Se não há nenhum indício de autenticação, não há nada para validar
  if (!hasLocal && !hasJWT) {
    console.log('❌ Nenhum token encontrado - usuário não autenticado');
    return false;
  }
  
  // Valida se a autenticação é realmente válida com o backend
  try {
    const response = await fetch('/user/profile', {
      method: 'GET',
      credentials: 'include'
    });
    
    if (response.ok) {
      console.log('✅ Autenticação válida confirmada pelo backend');
      return true;
    } else {
      console.log('❌ Autenticação inválida - limpando dados locais');
      // Limpa dados locais inválidos
      clearAllAuthData();
      return false;
    }
  } catch (error) {
    console.log('❌ Erro ao validar autenticação - limpando dados locais');
    // Em caso de erro, limpa os dados locais
    clearAllAuthData();
    return false;
  }
}

/**
 * Limpa todos os dados de autenticação do cliente
 */
export function clearAllAuthData(): void {
  console.log('🧹 Limpando todos os dados de autenticação...');
  
  // Remove todos os dados do localStorage relacionados à auth
  localStorage.removeItem('userToken');
  localStorage.removeItem('userName');
  localStorage.removeItem('userAvatar');
  localStorage.removeItem('user_id');
  
  // Tenta limpar o cookie JWT (embora seja httpOnly, pode ter outros cookies)
  document.cookie.split(';').forEach(cookie => {
    const eqPos = cookie.indexOf('=');
    const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
    if (name.includes('jwt') || name.includes('auth') || name.includes('token')) {
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;`;
    }
  });
  
  console.log('✅ Dados de autenticação limpos');
}

/**
 * Verifica se existe token no localStorage (verificação rápida, mas não 100% confiável)
 * @returns boolean
 */
export function hasLocalToken(): boolean {
  return !!(localStorage.getItem('userToken') || localStorage.getItem('userName'));
}

/**
 * Verifica se há um JWT cookie válido de forma síncrona
 * @returns boolean
 */
export function hasJWTCookie(): boolean {
  // Verifica se existe um cookie jwt
  const cookies = document.cookie.split(';');
  
  const jwtCookie = cookies.find(cookie => {
    const trimmed = cookie.trim();
    return trimmed.startsWith('jwt=');
  });
  
  const hasValidJWT = !!jwtCookie && jwtCookie.split('=')[1]?.trim() !== '';
  
  return hasValidJWT;
}

/**
 * Realiza um health check rápido da autenticação
 * Função leve para verificar se a sessão ainda é válida
 * @returns Promise<boolean>
 */
export async function quickAuthHealthCheck(): Promise<boolean> {
  // Se não há tokens, obviamente não está autenticado
  if (!hasJWTCookie() && !hasLocalToken()) {
    return false;
  }
  
  try {
    // Faz uma requisição muito leve para verificar autenticação
    const response = await fetch('/auth/validate', {
      method: 'HEAD', // Só verifica headers, sem buscar dados
      credentials: 'include'
    });
    
    return response.ok;
  } catch (error) {
    // Em caso de erro de rede, assume que não está autenticado
    return false;
  }
}

/**
 * Configura listeners para detectar mudanças no estado de autenticação
 * entre abas do navegador ou quando dados são limpos externamente
 */
export function setupAuthStateListeners(): void {
  // Detecta mudanças no localStorage entre abas
  window.addEventListener('storage', (event) => {
    if (event.key === 'userToken' || event.key === 'userName' || event.key === 'userAvatar') {
      console.log('📡 Mudança no estado de autenticação detectada em outra aba');
      
      // Se dados de autenticação foram removidos em outra aba
      if (!event.newValue && event.oldValue) {
        console.log('🔄 Dados de autenticação removidos - atualizando interface');
        window.location.reload();
      }
    }
  });
  
  // Detecta quando a aba volta a ficar visível (para verificar se sessão ainda é válida)
  document.addEventListener('visibilitychange', async () => {
    if (!document.hidden && (hasJWTCookie() || hasLocalToken())) {
      console.log('👁️ Aba ficou visível - verificando estado da sessão');
      
      // Pequeno delay para evitar verificações muito frequentes
      setTimeout(async () => {
        const isValid = await validateAndCleanAuthState();
        if (!isValid) {
          console.log('❌ Sessão inválida detectada ao retornar à aba');
          window.location.reload();
        }
      }, 1000);
    }
  });
}

/**
 * Força uma verificação completa de autenticação e atualiza a interface se necessário
 * Útil para ser chamada após ações importantes ou periodicamente
 * @returns Promise<boolean> - true se o usuário ainda estiver autenticado
 */
export async function recheckAuthenticationState(): Promise<boolean> {
  console.log('🔄 Reverificando estado de autenticação...');
  
  const isValid = await validateAndCleanAuthState();
  
  if (!isValid) {
    console.log('❌ Autenticação inválida detectada - forçando reload da interface');
    // Se a autenticação não for válida, força o reload para atualizar a interface
    window.location.reload();
    return false;
  }
  
  console.log('✅ Autenticação válida confirmada');
  return true;
}