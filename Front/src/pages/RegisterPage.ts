// src/pages/LoginPages.ts

import { renderRegisterForm } from '../components/FormRegister'
import { createFooter } from '../components/Footer';
import { createNavbar } from '../components/Navbar';
import { showToast } from '../utils/toast';

export function renderRegister(): void {
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
    renderRegisterForm(formContainer, {
      onLoginSuccess: (token) => {
        // Armazena o token JWT (para uso posterior em chamadas API)
        localStorage.setItem('authToken', token);
        
        // Mostra feedback visual
        showToast('Cadastro realizado com sucesso!', 'success');
        
        // Redireciona para a página inicial
        window.location.hash = '#/';
        
        // Se estiver usando um roteador SPA:
        // router.navigate('/');
      },
      onLoginError: (error) => {
        console.error('Erro no login:', error);
        showToast(error, 'error');
      },
      on2FASuccess: () => {
        // Callback adicional para quando a 2FA for verificada
        showToast('Verificação em duas etapas concluída!', 'success');
        
        // O token já foi tratado no onLoginSuccess,
        // esta função é opcional para feedback adicional
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
}