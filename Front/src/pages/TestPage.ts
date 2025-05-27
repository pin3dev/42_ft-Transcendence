// TestPage.ts
import { getCookie } from '../utils/cookieUtils';
import { fetchWithAuth } from '../utils/fetchWithAuth';

async function testProtectedRoute() {
  try {
    const token = getCookie('jwt');
    if (!token) {
      alert('Token JWT ausente. Faça login novamente.');
      return;
    }

    const response = await fetchWithAuth('http://localhost:1025/teste', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Erro ao acessar a rota protegida.');
    }

    const data = await response.json();
    console.log('Resposta da rota protegida:', data);
    alert(`Mensagem: ${data.message}, Usuário: ${JSON.stringify(data.user)}`);
  } catch (error) {
    console.error('Erro ao acessar a rota protegida:', error);
    alert('Erro ao acessar a rota protegida.');
  }
}

export function renderTestPage(): void {
    const root = document.getElementById('root');
    if (!root) return;
  
    root.innerHTML = '';
  
    const container = document.createElement('div');
    container.className = 'min-h-screen flex flex-col bg-arcade-dark';
  
    const button = document.createElement('button');
    button.textContent = 'Testar Rota Protegida';
    button.className = 'bg-blue-500 text-white px-4 py-2 rounded';
    button.onclick = testProtectedRoute;
  
    container.appendChild(button);
    root.appendChild(container);
  }