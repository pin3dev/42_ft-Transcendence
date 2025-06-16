import { renderHome } from '../pages/HomePage';
import { renderNotFound } from '../pages/NotFoundPage';
import { renderLogin } from '../pages/LoginPage';
import { renderHowToPlayPage } from '../pages/HowToPlayPage';
import { GamePage } from '../pages/GamePage';
import { GamePageTournament } from '../pages/GamePageTournament';
import { renderRegister } from '../pages/RegisterPage';
import { renderTestPage } from '../pages/TestPage';
import { validateAndCleanAuthState } from '../utils/auth';

// Definição das rotas disponíveis
const routes: Record<string, () => void | Promise<void>> = {
  '/': renderHome,
  '*': renderNotFound,
  '/Login': renderLogin,
  '/ComoJogar': renderHowToPlayPage,
  '/Game': () => renderProtectedRoute(GamePage),
  '/GameTournament': () => renderProtectedRoute(GamePageTournament),
  '/Register': renderRegister,
  '/Profile': () => renderProtectedRoute(renderTestPage)
};

// Lista de rotas que precisam de autenticação
const protectedRoutes = ['/Profile', '/Game'];

/**
 * Renderiza uma rota protegida após verificar autenticação
 */
async function renderProtectedRoute(renderFunction: () => void | Promise<void>) {
  //console.log('🔐 Verificando autenticação para rota protegida...');
  
  const isAuthenticated = await validateAndCleanAuthState();
  
  if (!isAuthenticated) {
    //console.log('❌ Usuário não autenticado - redirecionando para login');
    // Redireciona para login se não estiver autenticado
    window.history.replaceState(null, '', '/Login');
    renderLogin();
    return;
  }
  
  //console.log('✅ Usuário autenticado - renderizando rota protegida');
  await renderFunction();
}

// Função para renderizar a página baseada na rota atual
async function renderPage() {
  const path = window.location.pathname;
  
  // Limpa o conteúdo principal
  const root = document.getElementById('root');
  if (!root) return;
  
  root.innerHTML = '';
  
  // Encontra e renderiza a página correspondente ou usa 404
  const renderFunction = routes[path] || routes['*'];
  await renderFunction();
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
  if (window.location.pathname === url) {
    // Já está na rota desejada, não faz nada
    return;
  }
  window.history.pushState(null, '', url);
  renderPage();
}
