import { fetchWithAuth } from '../utils/fetchWithAuth';

interface Player {
  rank: number;
  username: string;
  total_wins: number;
  total_losses: number;
  win_rate: string;
  user_id: string;
}

/**
 * Cria um preview do leaderboard mostrando os top 5 jogadores
 */
export async function createLeaderboardPreview(): Promise<HTMLElement> {
  const section = document.createElement('section');
  section.className = 'py-16';
  
  const container = document.createElement('div');
  container.className = 'container mx-auto px-6';
  
  // Leaderboard table
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'max-w-3xl mx-auto';
  
  const tableContainer = document.createElement('div');
  tableContainer.className = 'arcade-container bg-arcade-darker rounded-lg overflow-hidden border-2 border-neon-green';
  
  const table = document.createElement('table');
  table.className = 'w-full';
  
  // Table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headerRow.className = 'border-neon-green/50 hover:bg-transparent';
  
  const headers = ['Rank', 'Jogador', 'V/D', 'Taxa de Vitória'];
  headers.forEach((headerText, index) => {
    const th = document.createElement('th');
    th.className = 'text-neon-green p-4 text-left';
    if (index >= 2) th.className += ' text-right';
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  
  // Table body
  const tbody = document.createElement('tbody');

  // Fetch players data
  let topPlayers: Player[] = [];
  try {
    const response = await fetchWithAuth('/tournament/ranking/top', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      topPlayers = data.slice(0, 5).map((player: any, index: number) => ({
        ...player,
        rank: index + 1,
      }));
    } else {
      // console.error("Erro ao carregar dados do ranking");
    }
  } catch (err) {
    // console.error("Erro ao buscar ranking:", err);
  }

  // Helper function to get player name
  const getPlayerName = async (userId: string): Promise<string> => {
    try {
      const response = await fetchWithAuth(`/user/search?id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          return data[0].name;
        }
        return 'Desconhecido';
      } else {
        // console.error("Erro ao buscar nome do jogador.");
        return 'Desconhecido';
      }
    } catch (err) {
      // console.error("Erro ao buscar nome do jogador:", err);
      return 'Desconhecido';
    }
  };
  
  // Create table rows
  for (const player of topPlayers) {
    const row = document.createElement('tr');
    row.className = `border-neon-green/30 hover:bg-neon-green/5 transition-colors ${player.rank === 1 ? "bg-neon-green/10" : ""}`;
  
    // Rank cell
    const rankCell = document.createElement('td');
    rankCell.className = 'font-medium p-4';
    if (player.rank === 1) {
      rankCell.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="inline mr-1 text-neon-green" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
        <span class="text-neon-green">${player.rank}</span>
      `;
    } else if (player.rank <= 3) {
      rankCell.innerHTML = `<span class='text-neon-green'>${player.rank}</span>`;
    } else {
      rankCell.textContent = player.rank.toString();
      rankCell.className += ' text-white';
    }
    
    // Player cell
    const playerCell = document.createElement('td');
    playerCell.className = 'font-medium p-4';
    
    const playerNameWrapper = document.createElement('div');
    playerNameWrapper.className = 'flex items-center gap-2';
    
    const playerName = document.createElement('span');
    playerName.className = player.rank <= 3 ? 'text-neon-green' : 'text-white';
    const name = await getPlayerName(player.user_id);
    playerName.textContent = name;
    
    playerNameWrapper.appendChild(playerName);
    
    // Add stars for top 3
    if (player.rank <= 3) {
      const starsDiv = document.createElement('div');
      starsDiv.className = 'flex';
      
      const starsCount = 4 - player.rank;
      for (let i = 0; i < starsCount; i++) {
        const star = document.createElement('span');
        star.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="text-neon-green" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        `;
        starsDiv.appendChild(star);
      }
      
      playerNameWrapper.appendChild(starsDiv);
    }
    
    playerCell.appendChild(playerNameWrapper);
    
    // W/L cell
    const wlCell = document.createElement('td');
    wlCell.className = 'text-right p-4 text-white';
    wlCell.textContent = `${player.total_wins}/${player.total_losses}`;
    
    // Win rate cell
    const winRateCell = document.createElement('td');
    winRateCell.className = 'text-right p-4 text-white'; // Corrigido para branco
    winRateCell.textContent = player.win_rate;
    
    // Add cells to row
    row.appendChild(rankCell);
    row.appendChild(playerCell);
    row.appendChild(wlCell);
    row.appendChild(winRateCell);
    
    tbody.appendChild(row);
  }
  
  // Assemble table
  table.appendChild(thead);
  table.appendChild(tbody);
  tableContainer.appendChild(table);
  
  // Assemble components
  tableWrapper.appendChild(tableContainer);
  container.appendChild(tableWrapper);
  section.appendChild(container);
  
  return section;
}

// Exportação nomeada adicional para compatibilidade
export { createLeaderboardPreview as default };