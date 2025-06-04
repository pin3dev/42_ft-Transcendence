// src/pages/TestPage.ts
import { fetchWithAuth } from '../utils/fetchWithAuth';
import { ProfileSection, type UserStats } from '../components/Profile';
import { createNavbar } from '../components/Navbar';
import { createFooter } from '../components/Footer';
import { createLeaderboardPreview } from '../components/LeaderboardPreview';
import { FriendsList, type Friend } from '../components/friends-list';
import { renderUserProfilePage } from '../pages/FriendProfilePage';
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

async function fetchPendingRequests(): Promise<Friend[]> {
  try {
    const response = await fetchWithAuth('http://localhost:1025/user/friends/pending', {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Erro ao carregar solicitações de amizade');
    }

    const data = await response.json();
    return (data || []).map((request: any) => ({
      id: request.user_id,
      name: request.name,
      status: 'pending',
      avatar: request.avatar_url
    }));
  } catch (error) {
    console.error('Erro ao carregar solicitações de amizade:', error);
    return []; // Retorna uma lista vazia em caso de erro
  }
}

// Adicione estas funções após fetchPendingRequests()

async function acceptFriendRequest(senderId: string): Promise<boolean> {
  try {
    const response = await fetchWithAuth('http://localhost:1025/user/friends/accept', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender_id: senderId }),
    });

    if (!response.ok) {
      throw new Error('Erro ao aceitar solicitação de amizade');
    }

    return true;
  } catch (error) {
    console.error('Erro ao aceitar solicitação de amizade:', error);
    return false;
  }
}

async function rejectFriendRequest(senderId: string): Promise<boolean> {
  try {
    const response = await fetchWithAuth('http://localhost:1025/user/friends/reject', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sender_id: senderId }),
    });

    if (!response.ok) {
      throw new Error('Erro ao rejeitar solicitação de amizade');
    }

    return true;
  } catch (error) {
    console.error('Erro ao rejeitar solicitação de amizade:', error);
    return false;
  }
}

async function removeFriend(targetId: string): Promise<boolean> {
  try {
    const response = await fetchWithAuth('http://localhost:1025/user/friends/remove', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ target_id: targetId }),
    });

    if (!response.ok) {
      throw new Error('Erro ao remover amizade');
    }

    return true;
  } catch (error) {
    console.error('Erro ao remover amizade:', error);
    return false;
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
// Wrapper da barra de pesquisa posicionado no canto superior direito do card
  const searchWrapper = document.createElement('div');
  searchWrapper.className = `
    absolute top-4 right-4 z-20
    flex items-center justify-end
  `;

  // Campo de input estilizado com visual neon
  const userSearchInput = document.createElement('input');
  userSearchInput.type = 'text';
  userSearchInput.placeholder = '🔍 Procurar usuário...';
  userSearchInput.className = `
    w-full max-w-xs
    bg-gradient-to-r from-[#4c1d95] to-[#581c87]
    text-white placeholder-white/60
    border border-neon-purple
    rounded-full px-4 py-2
    shadow-lg focus:outline-none focus:ring-2 focus:ring-neon-purple
    transition-all duration-300 ease-in-out
    text-sm animate-pulse-neon
  `;

  // Dropdown de resultados
  const userSearchResults = document.createElement('div');
  userSearchResults.className = `
    absolute top-full left-0 mt-2 w-full
    bg-arcade-dark border border-neon-purple
    rounded-lg shadow-lg text-sm z-50 overflow-hidden
  `;

  // Wrapper com posicionamento relativo
  const userSearchBox = document.createElement('div');
  userSearchBox.className = 'relative w-full max-w-xs';
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
              `;

             // Adiciona o evento de clique no item inteiro
             resultItem.addEventListener('click', () => {
              // Limpa a busca
              userSearchResults.innerHTML = '';
              userSearchInput.value = '';
              // Mostra o perfil do usuário
              renderUserProfilePage(user);
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
  // const leaderboardPreview = await createLeaderboardPreview();
  // gridContainer.appendChild(leaderboardPreview);

// Adiciona a lista de amigos com título personalizado
  const friendsList = new FriendsList({ 
    friends: mockFriends,
    title: 'Meus Amigos',  // Título personalizado para lista de amigos
    onRemove: async (friendId) => {
      const success = await removeFriend(friendId);
      if (success) {
        // Recarrega a lista de amigos para atualizar a UI
        const updatedFriends = await fetchFriendsList();
        friendsList.update({ friends: updatedFriends });
      }
    }
  });
  gridContainer.appendChild(friendsList.getElement());

  // Adiciona a lista de solicitações pendentes com título personalizado
  const pendingList = new FriendsList({ 
    friends: [],  // Inicialmente vazia, será preenchida pela API
    title: 'Solicitações de Amizade',  // Título personalizado para solicitações
    onAccept: async (friendId) => {
      const success = await acceptFriendRequest(friendId);
      if (success) {
        // Recarrega as listas para atualizar a UI
        const [updatedFriends, pendingRequests] = await Promise.all([
          fetchFriendsList(),
          fetchPendingRequests()
        ]);
        friendsList.update({ friends: updatedFriends });
        pendingList.update({ friends: pendingRequests });
      }
    },
    onReject: async (friendId) => {
      const success = await rejectFriendRequest(friendId);
      if (success) {
        // Apenas remove a solicitação rejeitada da lista pendente
        const pendingRequests = await fetchPendingRequests();
        pendingList.update({ friends: pendingRequests });
      }
    }
  });
  gridContainer.appendChild(pendingList.getElement());

  // Atualiza com dados reais da API
  try {
    const [updatedStats, updatedFriends, pendingRequests] = await Promise.all([
      testProtectedRoute(),
      fetchFriendsList(),
      fetchPendingRequests()
    ]);

    if (updatedStats) {
      profileSection.update({ userStats: updatedStats });
      insertUserSearchBar();
    }
    friendsList.update({ friends: updatedFriends });
    pendingList.update({ friends: pendingRequests });
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
  }

  mainContainer.appendChild(gridContainer);
  pageContainer.appendChild(mainContainer);

  // Adiciona o footer
  pageContainer.appendChild(createFooter());

  root.appendChild(pageContainer);
}