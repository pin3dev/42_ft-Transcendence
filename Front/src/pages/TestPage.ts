// src/pages/TestPage.ts
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { ProfileSection, type UserStats } from '../components/Profile';
import { createNavbar } from '../components/Navbar';
import { createFooter } from '../components/Footer';
import { createLeaderboardPreview } from '../components/LeaderboardPreview';
import { FriendsList, type Friend } from '../components/friends-list';
// Mock data - em produção viria de uma API
const mockUserProfile = {
  name: 'Player1',
  avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=player1'
};

const mockUserStats: UserStats = {
  name: 'Player1',
  wins: 15,
  losses: 8,
  avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=player1'
};

const mockRankingPlayers = [
  {
    rank: 1,
    name: 'ProPlayer',
    wins: 50,
    losses: 2,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=pro'
  },
  {
    rank: 2,
    name: 'Champion',
    wins: 45,
    losses: 5,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=champ'
  },
  {
    rank: 3,
    name: 'Player1',
    wins: 15,
    losses: 8,
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=player1'
  }
];

const mockFriends: Friend[] = [
  {
    id: 1,
    name: 'BestFriend',
    status: 'online',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=friend1'
  },
  {
    id: 2,
    name: 'GameBuddy',
    status: 'offline',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=friend2'
  },
  {
    id: 3,
    name: 'PingPongMaster',
    status: 'online',
    avatar: 'https://api.dicebear.com/7.x/pixel-art/svg?seed=friend3'
  }
];

async function testProtectedRoute(): Promise<UserStats | null> {
  try {
    const response = await fetchWithAuth('http://localhost:1025/user/profile', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Erro ao acessar a rota protegida.');
    }

    const data = await response.json();
    return {
      name: data.name || mockUserStats.name,
      wins: mockUserStats.wins,
      losses: mockUserStats.losses,
      avatar: data.avatar_url || mockUserStats.avatar
    };
  } catch (error) {
    console.error('Erro ao acessar a rota protegida:', error);
    return mockUserStats; // Retorna os dados mockados em caso de erro
  }
}

async function fetchFriendsList(): Promise<Friend[]> {
  try {
    const response = await fetchWithAuth('http://localhost:1025/user/friends', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar lista de amigos');
    }

    const data = await response.json();
    return (data.friends || []).map((friend: any) => ({
      id: friend.user_id,
      name: friend.name,
      status: 'offline', // ver
      avatar: friend.avatar_url
    }));
  } catch (error) {
    console.error('Erro ao carregar amigos:', error);
    return mockFriends; // Retorna os dados mockados em caso de erro
  }
}

export async function renderTestPage(): Promise<void> {
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

  // Cria e adiciona a seção de perfil
  const profileSection = new ProfileSection({
    userStats: mockUserStats,
    onPlay: () => {
      console.log('Starting game...');
      testProtectedRoute().then(updatedStats => {
        if (updatedStats) {
          profileSection.update({ userStats: updatedStats });
          insertUserSearchBar();
        }
      });
    }
  });
  const profileElement = profileSection.getElement();

// --- BARRA DE BUSCA DE USUÁRIOS DENTRO DO PERFIL ---
  // Wrapper para alinhar no topo e direita do card
const searchWrapper = document.createElement('div');
searchWrapper.className = 'flex justify-end items-start mt-[-12px] w-full';

// Estilo refinado para o input de busca
const userSearchInput = document.createElement('input');
userSearchInput.type = 'text';
userSearchInput.placeholder = 'Adicionar amigo...';
userSearchInput.className = `
  bg-gradient-to-r from-neon-purple to-arcade-darkPurple
  text-white
  placeholder-white/60
  border-none
  focus:outline-none
  focus:ring-0
  w-60
  rounded-full
  px-4 py-1
  text-sm
  transition-all
`;

// Dropdown dos resultados
const userSearchResults = document.createElement('div');
userSearchResults.className = `
  absolute z-30 mt-1 w-full
  bg-arcade-darkPurple border border-primary/10
  rounded-lg shadow-md text-sm
`;

// Wrapper do input com dropdown
const userSearchBox = document.createElement('div');
userSearchBox.className = 'relative w-60';
userSearchBox.appendChild(userSearchInput);
userSearchBox.appendChild(userSearchResults);
searchWrapper.appendChild(userSearchBox);

  // Função para inserir a barra de busca no slot do header do perfil
  function insertUserSearchBar() {
    const userSearchSlot = profileElement.querySelector('#user-search-slot');
    if (userSearchSlot && !userSearchSlot.contains(searchWrapper)) {
      userSearchSlot.appendChild(searchWrapper);
    }
  }

  // Insere a barra de busca inicialmente
  insertUserSearchBar();

  // Evento de busca
  userSearchInput.addEventListener('input', async (e) => {
    const value = (e.target as HTMLInputElement).value.trim();
    userSearchResults.innerHTML = '';
    if (value.length >= 2) {
      try {
        const response = await fetchWithAuth(`http://localhost:1025/user/search?name=${encodeURIComponent(value)}`);
        if (response.ok) {
          const users = await response.json();
          if (Array.isArray(users) && users.length > 0) {
            users.forEach((user: any) => {
              const resultItem = document.createElement('div');
              resultItem.className = 'flex items-center gap-2 px-2 py-1 hover:bg-primary/20 cursor-pointer rounded';

              resultItem.innerHTML = `
                <img src="${user.avatar_url}" class="w-6 h-6 rounded-full border border-primary" />
                <span class="flex-1 text-white">${user.name}</span>
                <button class="btn btn-xs btn-primary">Adicionar</button>
              `;

              resultItem.querySelector('button')?.addEventListener('click', async (ev) => {
                ev.stopPropagation();
                try {
                  const addResp = await fetchWithAuth('http://localhost:1025/user/friends/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ target_id: user.user_id })
                  });
                  if (addResp.ok) {
                    resultItem.querySelector('button')!.textContent = 'Enviado!';
                    resultItem.querySelector('button')!.setAttribute('disabled', 'true');
                  } else {
                    alert('Erro ao enviar solicitação.');
                  }
                } catch (err) {
                  alert('Erro ao enviar solicitação.');
                }
              });

              userSearchResults.appendChild(resultItem);
            });
          } else {
            userSearchResults.innerHTML = '<div class="text-gray-400 px-2 py-1">Nenhum usuário encontrado.</div>';
          }
        } else {
          userSearchResults.innerHTML = '<div class="text-red-400 px-2 py-1">Erro ao buscar usuários.</div>';
        }
      } catch (err) {
        userSearchResults.innerHTML = '<div class="text-red-400 px-2 py-1">Erro ao buscar usuários.</div>';
      }
    }
  });

  mainContainer.appendChild(profileElement);

  // Cria o grid para ranking e lista de amigos
  const gridContainer = document.createElement('div');
  gridContainer.className = 'grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8';

  // Adiciona o ranking (leaderboard)
  const leaderboardPreview = await createLeaderboardPreview();
  gridContainer.appendChild(leaderboardPreview);

  // Adiciona a lista de amigos
  const friendsList = new FriendsList({ friends: mockFriends });
  gridContainer.appendChild(friendsList.getElement());

  // Atualiza com dados reais da API
  try {
    const [updatedStats, updatedFriends] = await Promise.all([
      testProtectedRoute(),
      fetchFriendsList()
    ]);

    if (updatedStats) {
      profileSection.update({ userStats: updatedStats });
      insertUserSearchBar();
    }
    friendsList.update({ friends: updatedFriends });
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }

  mainContainer.appendChild(gridContainer);
  pageContainer.appendChild(mainContainer);

  // Adiciona o footer
  pageContainer.appendChild(createFooter());

  root.appendChild(pageContainer);
}