// src/pages/FriendProfilePage.ts
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { createNavbar } from '../components/Navbar';
import { createFooter } from '../components/Footer';
import { renderTestPage } from './TestPage';
import type { UserStats } from '../components/Profile';
import { createLeaderboardPreview } from '../components/LeaderboardPreview';

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

  let userStats: UserStats = {
    name: user.name,
    wins: 0,
    losses: 0,
    avatar: user.avatar_url,
    user_id: user.user_id,
    score: 1000, // padrão
  };

  if (!userStats.user_id) {
    console.error("user_id do amigo é indefinido!");
    return;
  }

  try {
    const response = await fetchWithAuth(`/tournament/ranking/user?user_id=${encodeURIComponent(userStats.user_id)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const stats = await response.json();
      userStats.wins = stats.total_wins;
      userStats.losses = stats.total_losses;
      userStats.score = stats.score;
    } else {
      console.warn("Não foi possível buscar estatísticas do amigo.");
    }
  } catch (err) {
    console.error("Erro ao buscar estatísticas do amigo:", err);
  }


  // Cria e adiciona a seção de perfil sem a barra de busca e botão de jogar
  const customProfile = document.createElement('div');
  customProfile.className = 'bg-arcade-dark rounded-lg overflow-hidden shadow-lg border border-neon-purple relative';
  
  // Header com background
  const profileHeader = document.createElement('div');
  profileHeader.className = 'h-24 bg-gradient-to-r from-neon-purple to-neon-blue rounded-t-lg';
  customProfile.appendChild(profileHeader);
  
  // Avatar
  const avatarContainer = document.createElement('div');
  avatarContainer.className = 'absolute top-24 left-1/2 transform -translate-x-1/2 z-10';
  avatarContainer.innerHTML = `
    <div class="w-32 h-32 rounded-full border-4 border-arcade-dark overflow-hidden bg-arcade-dark">
      <img src="${userStats.avatar}" alt="${userStats.name}" class="w-full h-full object-cover" />
    </div>
  `;
  customProfile.appendChild(avatarContainer);
  
  // Informações do usuário
  const userInfo = document.createElement('div');
  userInfo.className = 'mt-28 text-center p-6 bg-arcade-dark rounded-b-lg';
  userInfo.innerHTML = `
    <h2 class="text-2xl font-bold text-neon-blue !bg-transparent">${userStats.name}</h2>
    <div class="mt-4 flex justify-center space-x-8">
      <div class="text-center !bg-transparent">
        <div class="text-3xl font-bold text-green-400">${userStats.wins}</div>
        <div class="text-sm text-gray-400">Vitórias</div>
      </div>
      <div class="text-center !bg-transparent">
        <div class="text-3xl font-bold text-red-500">${userStats.losses}</div>
        <div class="text-sm text-gray-400">Derrotas</div>
      </div>
      <div class="text-center !bg-transparent">
        <div class="text-3xl font-bold text-yellow-300">${userStats.score}</div>
        <div class="text-sm text-gray-400">Score</div>
      </div>
    </div>
  `;

    // Adiciona o botão "Adicionar Amigo"
    const addFriendBtn = document.createElement('button');
    addFriendBtn.className = 'mt-6 px-4 py-2 bg-neon-blue text-white rounded-full hover:bg-opacity-80 transition-colors flex items-center gap-2 mx-auto';
    addFriendBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
      <span>Adicionar Amigo</span>
    `;
    
    // Manipulador de evento para o botão de adicionar amigo
    addFriendBtn.addEventListener('click', async () => {
      try {
        // Desabilita o botão durante a requisição
        addFriendBtn.disabled = true;
        addFriendBtn.innerHTML = 'Enviando solicitação...';
        
        const response = await fetchWithAuth('/user/friends/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            target_id: userStats.user_id
          })
        });
        
        if (response.ok) {
          // Atualiza o botão para mostrar que a solicitação foi enviada
          addFriendBtn.className = 'mt-6 px-4 py-2 bg-neon-green text-black rounded-full flex items-center justify-center gap-2 mx-auto w-fit whitespace-nowrap';
          addFriendBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>Solicitação Enviada</span>
          `;
        } else {
          const errorData = await response.json();
          
          // Verifica se já existe uma relação
          if (errorData.error && errorData.error.includes("Já existe uma relação")) {
            addFriendBtn.className = 'mt-6 px-4 py-2 bg-gray-500 text-black rounded-full flex items-center justify-center gap-2 mx-auto w-fit whitespace-nowrap';
            addFriendBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
              <span>Já existe uma solicitação</span>
            `;
          } else {
            // Reativa o botão em caso de erro
            addFriendBtn.disabled = false;
            addFriendBtn.className = 'mt-6 px-4 py-2 bg-neon-red text-white rounded-full hover:bg-opacity-80 transition-colors flex items-center gap-2 mx-auto';
            addFriendBtn.innerHTML = `
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              <span>Tentar Novamente</span>
            `;
            
            // Mostra mensagem de erro
            const errorMsg = document.createElement('div');
            errorMsg.className = 'text-white text-sm mt-2';
            errorMsg.textContent = errorData.error || 'Erro ao enviar solicitação de amizade';
            userInfo.appendChild(errorMsg);
            
            // Remove a mensagem após 5 segundos
            setTimeout(() => {
              errorMsg.remove();
            }, 5000);
          }
        }
      } catch (error) {
        console.error('Erro ao enviar solicitação de amizade:', error);
        
        // Reativa o botão em caso de erro
        addFriendBtn.disabled = false;
        addFriendBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Tentar Novamente</span>
        `;
      }
    });

    userInfo.appendChild(addFriendBtn);
    customProfile.appendChild(userInfo);

    mainContainer.appendChild(customProfile);

    // Chama o leaderboard depois que a página foi renderizada
    setTimeout(async () => {
      const matchHistorySection = await createLeaderboardPreview(userStats.user_id);
      mainContainer.appendChild(matchHistorySection);
    }, 0);

    pageContainer.appendChild(mainContainer);
    pageContainer.appendChild(createFooter());

    root.appendChild(pageContainer);

}