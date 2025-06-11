import { createNavbar } from '../components/Navbar';
import { createHero } from '../components/Hero';
import { createCreatorsSection } from '../components/Creators';
import { createLeaderboardPreview } from '../components/LeaderboardPreview';
import { createFooter } from '../components/Footer';
import { hasJWTCookie, hasLocalToken } from '../utils/auth';

export async function renderHome(): Promise<void> {
  const root = document.getElementById('root');
  if (!root) return;
  
  // Limpa o root
  root.innerHTML = '';
  
  // Cria a estrutura da página
  const container = document.createElement('div');
  container.className = 'min-h-screen flex flex-col bg-arcade-darkPurple';
  
  // Adiciona os componentes
  container.appendChild(createNavbar());
  
  const main = document.createElement('main');
  main.className = 'flex-grow container mx-auto px-4 py-8';
  
  main.appendChild(createHero());
  main.appendChild(createCreatorsSection());

  // Header do leaderboard
  const header = document.createElement('div');
  header.className = 'text-center mb-8';

  const title = document.createElement('h2');
  title.className = 'text-3xl md:text-4xl font-bold mb-4 text-white';
  title.innerHTML = `Top Jogadores `;
  
  const subtitle = document.createElement('p');
  subtitle.className = 'text-xl text-gray-300 max-w-3xl mx-auto';
  subtitle.textContent = 'Os melhores jogadores de PingPong Arcade. Você pode ser o próximo?';
  
  header.appendChild(title);
  header.appendChild(subtitle);

  main.appendChild(header);

  // Só tenta carregar o leaderboard se o usuário estiver autenticado
  const isAuthenticated = hasJWTCookie() || hasLocalToken();
  
  if (isAuthenticated) {
    try {
      const leaderboardElement = await createLeaderboardPreview();
      main.appendChild(leaderboardElement);
    } catch (error) {
      console.error('Erro ao carregar leaderboard:', error);
      // Adiciona mensagem de erro caso o leaderboard falhe
      const errorDiv = document.createElement('div');
      errorDiv.className = 'text-center text-red-400 py-8';
      errorDiv.textContent = 'Erro ao carregar ranking. Tente novamente mais tarde.';
      main.appendChild(errorDiv);
    }
  } else {
    // Para usuários não autenticados, mostra uma mensagem incentivando o login
    const loginPromptDiv = document.createElement('div');
    loginPromptDiv.className = 'text-center py-12';
    loginPromptDiv.innerHTML = `
      <div class="bg-arcade-darker border border-neon-blue rounded-lg p-8 max-w-md mx-auto">
        <h3 class="text-xl font-bold text-neon-blue mb-4">Faça login para ver o ranking</h3>
        <p class="text-gray-300 mb-6">Entre na sua conta para ver os melhores jogadores e competir pelo topo!</p>
        <div class="flex gap-4 justify-center">
          <button id="login-btn-homepage" class="bg-neon-blue text-black px-6 py-2 rounded hover:bg-neon-green transition-colors">
            Fazer Login
          </button>
          <button id="register-btn-homepage" class="border border-neon-blue text-neon-blue px-6 py-2 rounded hover:bg-neon-blue hover:text-black transition-colors">
            Registrar
          </button>
        </div>
      </div>
    `;
    
    // Adicionar event listeners para os botões
    const loginBtnHomepage = loginPromptDiv.querySelector('#login-btn-homepage');
    const registerBtnHomepage = loginPromptDiv.querySelector('#register-btn-homepage');
    
    loginBtnHomepage?.addEventListener('click', () => {
      window.location.hash = '#/Login';
    });
    
    registerBtnHomepage?.addEventListener('click', () => {
      window.location.hash = '#/Register';
    });
    
    main.appendChild(loginPromptDiv);
  }

  container.appendChild(main);
  container.appendChild(createFooter());
  root.appendChild(container);
}