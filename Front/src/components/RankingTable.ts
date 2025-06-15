// Front/src/components/RankingTable.ts

/**
 * Este módulo cria e gerencia uma tabela de classificação do torneio,
 * estilizada para o tema "Neon Arcade" e projetada para atualizações dinâmicas.
 */

// --- INTERFACE DE DADOS ---
// Define a estrutura de dados para uma única linha da tabela de classificação.
export interface RankingData {
  position: number;
  userId: string;
  numOfMatch: number;
  stars: number;
  numberOfVictories: number;
  pointsBalance: number;
  pointsMake: number;
}

// --- DADOS INICIAIS PARA VISUALIZAÇÃO ---
// Útil para desenvolvimento e para que a tabela não comece vazia.
const initialRankingData: RankingData[] = [
    { position: 1, playerName: 'Aguardando...', numOfMatch: 0, stars: 0, numberOfVictories: 0, pointsBalance: 0, pointsMake: 0 },
    { position: 2, playerName: 'Aguardando...', numOfMatch: 0, stars: 0, numberOfVictories: 0, pointsBalance: 0, pointsMake: 0 },
];

/**
 * Cria uma única linha <tr> para a tabela de classificação.
 * @param playerData Os dados do jogador para esta linha.
 * @returns Um elemento <tr> HTML.
 */
function createRankingRow(playerData: RankingData): HTMLElement {
    const row = document.createElement('tr');
    row.className = 'border-b border-neon-purple/20 hover:bg-neon-purple/30 transition-colors duration-200';

    // Helper para criar células <td>
    const createCell = (content: string, extraClasses: string = '') => {
        const cell = document.createElement('td');
        cell.className = `py-2 px-2 ${extraClasses}`;
        cell.textContent = content;
        return cell;
    };

    // Células da tabela na ordem desejada
    row.appendChild(createCell(playerData.position.toString(), 'font-bold text-white text-center'));
    row.appendChild(createCell(playerData.userId, 'font-semibold'));
    row.appendChild(createCell(playerData.stars.toString(), 'font-mono font-bold text-center')); // PTS
    row.appendChild(createCell(playerData.numOfMatch.toString(), 'font-mono text-center')); // P
    row.appendChild(createCell(playerData.numberOfVictories.toString(), 'font-mono text-center')); // V
    row.appendChild(createCell(playerData.pointsBalance.toString(), 'font-mono text-center')); // SG
    row.appendChild(createCell(playerData.pointsMake.toString(), 'font-mono text-center')); // GP

    return row;
}

/**
 * Atualiza dinamicamente o corpo da tabela de classificação com novos dados.
 * @param container O elemento <tbody> da tabela.
 * @param rankings Um array de dados de classificação.
 */
export function updateRankingTable(container: HTMLElement, rankings: RankingData[]): void {
    container.innerHTML = ''; // Limpa o conteúdo existente

    rankings.forEach(playerData => {
        const row = createRankingRow(playerData);
        container.appendChild(row);
    });
}

/**
 * Constrói o componente completo da tabela de classificação (a estrutura estática).
 * @returns O elemento <section> raiz do componente.
 */
export function createRankingTable(): HTMLElement {
    const section = document.createElement('section');
    section.className = 'py-4 w-full';

    const container = document.createElement('div');
    container.className = 'container mx-auto';
    section.appendChild(container);

    const mainTitle = document.createElement('h2');
    mainTitle.className = 'text-xl font-bold mb-3 text-white text-center';
    mainTitle.textContent = 'CLASSIFICAÇÃO';
    container.appendChild(mainTitle);

    const tableContainer = document.createElement('div');
    tableContainer.className = 'arcade-container bg-black rounded-lg overflow-hidden border-2 border-neon-purple w-full';

    const table = document.createElement('table');
    table.className = 'w-full text-sm text-left text-gray-300';
    
    const thead = document.createElement('thead');
    thead.className = 'text-xs text-neon-blue uppercase bg-gray-900/50';
    thead.innerHTML = `
        <tr>
            <th scope="col" class="py-3 px-2 text-center">#</th>
            <th scope="col" class="py-3 px-2">Jogador</th>
            <th scope="col" class="py-3 px-2 text-center" title="Pontos">PTS</th>
            <th scope="col" class="py-3 px-2 text-center" title="Partidas Jogadas">P</th>
            <th scope="col" class="py-3 px-2 text-center" title="Vitórias">V</th>
            <th scope="col" class="py-3 px-2 text-center" title="Saldo de Pontos">SP</th>
            <th scope="col" class="py-3 px-2 text-center" title="Pontos Feitos">PF</th>
        </tr>
    `;

    const tbody = document.createElement('tbody');
    tbody.id = 'ranking-table-body'; // ID para fácil acesso

    table.append(thead, tbody);
    tableContainer.appendChild(table);
    container.appendChild(tableContainer);

    // Popula com dados iniciais na criação
    updateRankingTable(tbody, initialRankingData);

    return section;
}