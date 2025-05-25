
import { navigateTo } from '../router/index';

export function createLeaderboardPreview(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'py-16 ';
  
  const container = document.createElement('div');
  container.className = 'container mx-auto px-6';
  
  // Header
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
  
  const topPlayers = [
    { rank: 1, username: "NeonMaster99", wins: 342, losses: 45, winRate: "88.4%" },
    { rank: 2, username: "PingPongKing", wins: 304, losses: 62, winRate: "83.1%" },
    { rank: 3, username: "ArcadeLegend", wins: 287, losses: 59, winRate: "82.9%" },
    { rank: 4, username: "PaddleWizard", wins: 265, losses: 78, winRate: "77.3%" },
    { rank: 5, username: "TableTitanX", wins: 251, losses: 83, winRate: "75.2%" }
  ];
  
  topPlayers.forEach(player => {
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
    wlCell.textContent = `${player.wins}/${player.losses} `;
    
    // Win rate cell
    const winRateCell = document.createElement('td');
    winRateCell.className = `text-right p-4 ${player.rank === 1 ? "text-neon-green" : "text-white"}`;
    winRateCell.textContent = player.winRate;
    
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
  
  // View full rankings button
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex justify-center mt-8';
  
  const viewMoreButton = document.createElement('button');
  viewMoreButton.className = 'border-neon-green text-neon-green hover:bg-neon-green hover:text-arcade-darker border px-4 py-2 rounded';
  viewMoreButton.textContent = 'Ver Ranking Completo';
  viewMoreButton.addEventListener('click', () => navigateTo('/rankings'));
  
  buttonContainer.appendChild(viewMoreButton);
  
  // Assemble components
  tableWrapper.appendChild(tableContainer);
  tableWrapper.appendChild(buttonContainer);
  
  container.appendChild(header);
  container.appendChild(tableWrapper);
  
  section.appendChild(container);
  
  return section;
}
