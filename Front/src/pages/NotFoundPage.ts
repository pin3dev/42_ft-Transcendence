
import { createNavbar } from '../components/Navbar';
import { createFooter } from '../components/Footer';
import { navigateTo } from '../router/index';

export function renderNotFound(): void {
  const root = document.getElementById('root');
  if (!root) return;
  
  // Cria a estrutura da página
  const container = document.createElement('div');
  container.className = 'min-h-screen flex flex-col bg-arcade-dark';
  
  // Adiciona navbar
  container.appendChild(createNavbar());
  
  // Conteúdo principal
  const main = document.createElement('main');
  main.className = 'flex-grow container mx-auto px-4 py-8';
  
  const errorContainer = document.createElement('div');
  errorContainer.className = 'min-h-[70vh] flex items-center justify-center';
  
  const errorContent = document.createElement('div');
  errorContent.className = 'text-center max-w-md mx-auto arcade-container bg-arcade-darker p-8';
  
  // Título do erro
  const errorTitle = document.createElement('h1');
  errorTitle.className = 'text-6xl font-bold mb-4 text-neon-pink animate-glow';
  errorTitle.textContent = '404';
  
  // Mensagem de erro
  const errorMessage = document.createElement('p');
  errorMessage.className = 'text-xl text-neon-blue mb-8';
  errorMessage.textContent = 'Game Over! Página não encontrada';
  
  // Botão voltar
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex justify-center';
  
  const button = document.createElement('button');
  button.className = 'bg-neon-green text-arcade-darker hover:bg-neon-blue hover:text-white px-4 py-2 rounded';
  button.textContent = 'Continuar → Inserir Moeda';
  button.addEventListener('click', () => navigateTo('/'));
  
  // Monta a estrutura
  buttonContainer.appendChild(button);
  errorContent.appendChild(errorTitle);
  errorContent.appendChild(errorMessage);
  errorContent.appendChild(buttonContainer);
  errorContainer.appendChild(errorContent);
  main.appendChild(errorContainer);
  
  container.appendChild(main);
  container.appendChild(createFooter());
  
  // Insere no DOM
  root.appendChild(container);
}
