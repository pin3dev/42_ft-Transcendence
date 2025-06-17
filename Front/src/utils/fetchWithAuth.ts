import { showToast } from './toast';
import { clearAllAuthData } from './auth';

export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const response = await fetch(url, {
    ...options,
    credentials: 'include', 
  });
   
  // Se receber 401 (Unauthorized) ou 403 (Forbidden)
  if (response.status === 401 || response.status === 403) {
    //console.logog('🚨 Sessão expirada ou inválida - limpando dados de autenticação');
    
    // Limpa automaticamente os dados de autenticação inválidos
    clearAllAuthData();
    
    // Apenas lança um erro sem mostrar toast automaticamente
    throw new Error('Sessão expirada');
  }
  
  return response;
} catch (error) {
  // Se for o erro que nós mesmos lançamos, apenas repassa
  if (error instanceof Error && error.message === 'Sessão expirada') {
    throw error;
  }
  
  // Para outros erros de rede, apenas lança o erro sem mostrar toast
  console.error('Erro de conexão:', error);
  throw error;
}
}
