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
      name: data.user?.username || mockUserStats.name,
      wins: data.user?.stats?.wins || mockUserStats.wins,
      losses: data.user?.stats?.losses || mockUserStats.losses,
      avatar: data.user?.avatar_url || mockUserStats.avatar
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
    return data.map((friend: any) => ({
      id: friend.id,
      name: friend.username,
      status: friend.status,
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
        }
      });
    }
  });
  mainContainer.appendChild(profileSection.getElement());

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