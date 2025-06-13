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
  // Debug: vamos ver todos os cookies
  console.log('🍪 Todos os cookies:', document.cookie);
  
  // Verifica se existe um cookie jwt
  const cookies = document.cookie.split(';');
  console.log('🍪 Cookies divididos:', cookies);
  
  const jwtCookie = cookies.find(cookie => {
    const trimmed = cookie.trim();
    console.log('🍪 Verificando cookie:', trimmed);
    return trimmed.startsWith('jwt=');
  });
  
  console.log('🍪 JWT Cookie encontrado:', jwtCookie);
  
  const hasValidJWT = !!jwtCookie && jwtCookie.split('=')[1]?.trim() !== '';
  console.log('🍪 Tem JWT válido:', hasValidJWT);
  
  return hasValidJWT;
}