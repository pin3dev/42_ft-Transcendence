// src/pages/TestPage.ts
import { fetchWithAuth } from '../utils/fetchWithAuth';

async function testProtectedRoute() {
  try {
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
  container.className = 'min-h-screen flex flex-col items-center justify-center bg-arcade-dark';

  const title = document.createElement('h1');
  title.textContent = 'Página de Teste da Rota Protegida';
  title.className = 'text-white text-2xl mb-4';

  const button = document.createElement('button');
  button.textContent = 'Testar Rota Protegida';
  button.className = 'bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded transition';
  button.onclick = testProtectedRoute;

  container.appendChild(title);
  container.appendChild(button);
  root.appendChild(container);
}
