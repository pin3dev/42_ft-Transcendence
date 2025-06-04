import { showToast } from './toast';
export async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  try {
    const response = await fetch(url, {
    ...options,
    credentials: 'include', 
  });
   // Se receber 401 (Unauthorized) ou 403 (Forbidden)
   if (response.status === 401 || response.status === 403) {
    // Mostra um aviso ao usuário
    showToast('Sua sessão expirou. Por favor, faça login novamente.', 'error');
    
    // Pequeno atraso para garantir que o usuário veja a mensagem
    setTimeout(() => {
      window.location.href = '/';
    }, 1500);
    
    // Lança um erro para interromper o processamento
    throw new Error('Sessão expirada');
  }
  
  return response;
} catch (error) {
  // Se for o erro que nós mesmos lançamos, apenas repassa
  if (error instanceof Error && error.message === 'Sessão expirada') {
    throw error;
  }
  
  // Para outros erros de rede, também redireciona
  showToast('Erro de conexão. Por favor, faça login novamente.', 'error');
  setTimeout(() => {
    window.location.href = '/';
  }, 1500);
  
  throw error;
}
}
