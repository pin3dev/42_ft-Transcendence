// src/pages/FriendProfilePage.ts
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { createNavbar } from '../components/Navbar';
import { createFooter } from '../components/Footer';
import { renderTestPage } from './TestPage';
import type { UserStats } from '../components/Profile';

export async function renderUserProfilePage(user: any): Promise<void> {
  const root = document.getElementById('root');
  if (!root) return;

  root.innerHTML = '';

  // Cria a estrutura principal da página
  const pageContainer = document.createElement('div');
  pageContainer.className = 'min-h-screen bg-arcade-darkPurple flex flex-col';

  // Adiciona a navbar
  pageContainer.appendChild(createNavbar());

  // Cria o container principal do conteúdo
  const mainContainer = document.createElement('div');
  mainContainer.className = 'container mx-auto px-4 py-8 flex-grow';

  // Botão para voltar
  const backButton = document.createElement('button');
  backButton.className = 'mb-4 px-4 py-2 bg-arcade-dark text-neon-blue hover:bg-opacity-80 rounded-md transition-colors flex items-center gap-2';
  backButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clip-rule="evenodd" />
    </svg>
    <span>Voltar</span>
  `;
  
  backButton.addEventListener('click', () => {
    renderTestPage();
  });
  
  mainContainer.appendChild(backButton);

  // Define as estatísticas iniciais com os dados já disponíveis
  let userStats: UserStats = {
    name: user.name,
    wins: user.wins || 0,
    losses: user.losses || 0,
    avatar: user.avatar_url
  };

  // Tenta buscar informações completas do usuário
  try {
    const response = await fetchWithAuth(`http://localhost:1025/user/profile/${user.user_id}`, {
      method: 'GET',
    });

    if (response.ok) {
      const data = await response.json();
      // Atualiza os dados caso tenha recebido da API
      userStats = {
        name: data.name || user.name,
        wins: data.wins || userStats.wins,
        losses: data.losses || userStats.losses,
        avatar: data.avatar_url || user.avatar_url
      };
    }
  } catch (error) {
    console.error('Erro ao buscar dados do usuário:', error);
    // Continua com os dados já disponíveis
  }

  // Cria e adiciona a seção de perfil sem a barra de busca e botão de jogar
  const customProfile = document.createElement('div');
  customProfile.className = 'bg-arcade-dark rounded-lg overflow-hidden shadow-lg border border-neon-purple relative';
  
  // Header com background
  const profileHeader = document.createElement('div');
  profileHeader.className = 'h-32 bg-gradient-to-r from-neon-purple to-neon-blue';
  customProfile.appendChild(profileHeader);
  
  // Avatar
  const avatarContainer = document.createElement('div');
  avatarContainer.className = 'absolute top-16 left-1/2 transform -translate-x-1/2';
  avatarContainer.innerHTML = `
    <div class="w-32 h-32 rounded-full border-4 border-arcade-dark overflow-hidden bg-arcade-dark">
      <img src="${userStats.avatar}" alt="${userStats.name}" class="w-full h-full object-cover" />
    </div>
  `;
  customProfile.appendChild(avatarContainer);
  
  // Informações do usuário
  const userInfo = document.createElement('div');
  userInfo.className = 'mt-20 text-center p-4';
  userInfo.innerHTML = `
    <h2 class="text-2xl font-bold text-neon-blue">${userStats.name}</h2>
    <div class="mt-4 flex justify-center space-x-8">
      <div class="text-center">
        <div class="text-3xl font-bold text-neon-green">${userStats.wins}</div>
        <div class="text-sm text-gray-400">Vitórias</div>
      </div>
      <div class="text-center">
        <div class="text-3xl font-bold text-neon-red">${userStats.losses}</div>
        <div class="text-sm text-gray-400">Derrotas</div>
      </div>
    </div>
  `;
  customProfile.appendChild(userInfo);
  
  mainContainer.appendChild(customProfile);
  pageContainer.appendChild(mainContainer);
  pageContainer.appendChild(createFooter());
  
  root.appendChild(pageContainer);
}