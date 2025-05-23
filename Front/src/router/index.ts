import { renderHome } from '../pages/HomePage';
import { renderNotFound } from '../pages/NotFoundPage';
import { renderLogin } from '../pages/LoginPage';
import { renderHowToPlayPage } from '../pages/HowToPlayPage';
import { renderGamePage } from '../pages/GamePage';
import { renderRegister } from '../pages/RegisterPage';

// Definição das rotas disponíveis
const routes: Record<string, () => void> = {
  '/': renderHome,
  '*': renderNotFound,
  '/Login': renderLogin,
  '/ComoJogar': renderHowToPlayPage,
  '/Game': renderGamePage,
  '/Register': renderRegister
};

// Função para renderizar a página baseada na rota atual
function renderPage() {
  const path = window.location.pathname;
  
  // Limpa o conteúdo principal
  const root = document.getElementById('root');
  if (!root) return;
  
  root.innerHTML = '';
  
  // Encontra e renderiza a página correspondente ou usa 404
  const renderFunction = routes[path] || routes['*'];
  renderFunction();
}

// Inicializa o roteador
export function initializeRouter() {
  // Intercepta cliques em links para não recarregar a página
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const link = target.closest('a');
    
    if (link && link.getAttribute('href')?.startsWith('/')) {
      e.preventDefault();
      const url = link.getAttribute('href') || '/';
      navigateTo(url);
    }
  });

  // Intercepta navegação pelo histórico (voltar/avançar)
  window.addEventListener('popstate', renderPage);
  
  // Renderiza a página inicial
  renderPage();
}

// Função para navegar sem recarregar a página
export function navigateTo(url: string) {
  window.history.pushState(null, '', url);
  renderPage();
}
