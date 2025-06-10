// src/pages/LoginPages.ts
import { renderLoginForm } from '../components/FormLogin';
import { createFooter } from '../components/Footer';
import { createNavbar } from '../components/Navbar';
import { showToast } from '../utils/toast';
import { render2FAPage } from './2faPage';
import { setCookie } from '../utils/cookieUtils';

export function renderLogin(): void {
  const root = document.getElementById('root');
  if (!root) return;

  // Limpa o conteúdo anterior (se necessário)
  root.innerHTML = '';

  // Cria a estrutura da página
  const container = document.createElement('div');
  container.className = 'min-h-screen flex flex-col bg-arcade-dark';

  // Adiciona a navbar
  container.appendChild(createNavbar());

  // Cria o elemento main que vai conter o formulário
  const main = document.createElement('main');
  main.className = 'flex-grow container mx-auto px-4 py-8 flex justify-center items-center';

  // Cria um container específico para o formulário
  const formContainer = document.createElement('div');
  formContainer.className = 'w-full max-w-lg';

  // Renderiza o formulário dentro do container com todos os callbacks atualizados
  renderLoginForm(formContainer, {
    onLoginSuccess: async (response) => {
      console.log('Resposta do backend:', response); // Verifique a resposta no console
  
      if (!response) {
        console.error('Resposta de login está indefinida.');
        return;
      }
  
      // Armazena o user_id no localStorage
      localStorage.setItem('user_id', response.user_id);
  
      // Verifica se o backend exige 2FA
      if (response.status === '2FA_REQUIRED') {
        showToast('Autenticação de dois fatores necessária!', 'info');
  
        // Redireciona para a página de 2FA com ou sem QR Code
        render2FAPage(response.qr_code || null); // Passa null se qr_code não estiver presente
      } else {
        console.error('Resposta inesperada do backend:', response);
      }
    },
    onLoginError: (error) => {
      console.error('Erro no login:', error);
      showToast(error, 'error');
    }
  });

  // Adiciona o formulário ao main
  main.appendChild(formContainer);

  // Adiciona o main ao container principal
  container.appendChild(main);

  // Adiciona o footer
  container.appendChild(createFooter());

  // Insere tudo no DOM
  root.appendChild(container);

  // Adiciona o CSS para o spinner de loading dinamicamente
  const style = document.createElement('style');
  style.textContent = `
    .loading-spinner {
      display: inline-block;
      width: 1.5rem;
      height: 1.5rem;
      border: 3px solid rgba(255,255,255,.3);
      border-radius: 50%;
      border-top-color: white;
      animation: spin 1s ease-in-out infinite;
      margin: 0 auto;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `;
  document.head.appendChild(style);
}