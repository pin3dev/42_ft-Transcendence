
import { fetchWithAuth } from '../utils/fetchWithAuth';

interface Player {
  rank: number;
  username: string;
  total_wins: number;
  total_losses: number;
  win_rate: string;
}

export async function createLeaderboardPreview(): Promise<HTMLElement> {
  const section = document.createElement('section');
  section.className = 'py-16 ';
  
  const container = document.createElement('div');
  container.className = 'container mx-auto px-6';
  
  // Header
  const header = document.createElement('div');
  header.className = 'text-center mb-8';
  

  
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

  let topPlayers = [];
    try {
    const response = await fetchWithAuth('/tournament/ranking/top', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();

      // Adicionando rank aos jogadores
      topPlayers = data.slice(0, 5).map((player: Player, index: number) => ({
        ...player,
        rank: index + 1, // Rank baseado na posição (0 é o primeiro, 1 é o segundo...)
      }));
    } else {
      console.error("Erro ao carregar dados do ranking");
    }
  } catch (err) {
    console.error("Erro ao buscar ranking:", err);
  }

  
  topPlayers.forEach((player: Player) => {
    const row = document.createElement('tr');
    row.className = `
      border-neon-green/30 hover:bg-neon-green/5 transition-colors
      ${player.rank === 1 ? "bg-neon-green/10" : ""}
    `;
    
    // Rank cell
    const rankCell = document.createElement('td');
    rankCell.className = 'font-medium p-4';
    if (player.rank === 1) {
      rankCell.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="inline mr-1 text-neon-green" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="8" r="6"/>
          <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>
        </svg>
        ${player.rank}
      `;
    } else {
      rankCell.textContent = player.rank.toString();
    }
    
    // Player cell
    const playerCell = document.createElement('td');
    playerCell.className = 'font-medium p-4';
    
    const playerNameWrapper = document.createElement('div');
    playerNameWrapper.className = 'flex items-center gap-2';
    
    const playerName = document.createElement('span');
    playerName.className = player.rank <= 3 ? 'text-neon-green' : 'text-white';
    playerName.textContent = player.username;
    
    playerNameWrapper.appendChild(playerName);
    
    // Add stars for top 3
    if (player.rank <= 3) {
      const starsDiv = document.createElement('div');
      starsDiv.className = 'flex';
      
      const starsCount = 4 - player.rank; // 3 stars for rank 1, 2 for rank 2, 1 for rank 3
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
    wlCell.textContent = `${player.total_wins}/${player.total_losses} `;
    
    // Win rate cell
    const winRateCell = document.createElement('td');
    winRateCell.className = `text-right p-4 ${player.rank === 1 ? "text-neon-green" : "text-white"}`;
    winRateCell.textContent = player.win_rate;
    
    // Add cells to row
    row.appendChild(rankCell);
    row.appendChild(playerCell);
    row.appendChild(wlCell);
    row.appendChild(winRateCell);
    
    tbody.appendChild(row);
  });
  
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
