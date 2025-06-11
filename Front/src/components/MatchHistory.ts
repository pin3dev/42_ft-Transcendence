
import { fetchWithAuth } from '../utils/fetchWithAuth';

interface Match {
  adversario_id: string;
  resultado: string;
  placar: string;
  data: string;
  tipo: string;
}

const getAdversarioName = async (adversarioId: string): Promise<string> => {
  try {
    const response = await fetchWithAuth(`/user/search?id=${adversarioId}`);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        return data[0].name; // Corrigido: pega o nome do primeiro usuário encontrado
      }
      return 'Desconhecido';
    } else {
      console.error("Erro ao buscar nome do adversário.");
      return 'Desconhecido'; // Caso haja erro na requisição
    }
  } catch (err) {
    console.error("Erro ao buscar nome do adversário:", err);
    return 'Desconhecido'; // Caso haja erro na requisição
  }
};

export async function createMatchHistory(targetUserId?: string): Promise<HTMLElement> {
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
  
  const headers = ['Adversário', 'Resultado', 'Placar', 'Data', 'Tipo'];
  headers.forEach((headerText, index) => {
    const th = document.createElement('th');
    th.className = 'text-neon-green p-4 text-center';
    //if (index >= 2) th.className += ' text-right';
    th.textContent = headerText;
    headerRow.appendChild(th);
  });
  
  thead.appendChild(headerRow);
  
  // Table body
  const tbody = document.createElement('tbody');

  let matchHistory: Match[] = [];
  try {
    const url = targetUserId 
      ? `/tournament/matches/history?user_id=${encodeURIComponent(targetUserId)}`
      : '/tournament/matches/history';

    const response = await fetchWithAuth(url, { // O `1` é o user_id, deve ser dinâmico
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.ok) {
      const data = await response.json();
      matchHistory = data.data || [];  // Assumindo que a chave de dados é `data`
    } else {
      console.error("Erro ao carregar dados do histórico de partidas");
    }
  } catch (err) {
    console.error("Erro ao buscar histórico de partidas:", err);
  }

  // Renderiza os jogos na tabela
  for (const match of matchHistory) {
    const row = document.createElement('tr');
    row.className = 'border-neon-green/30 hover:bg-neon-green/5 transition-colors';

    // Adversário cell
    const adversarioName = await getAdversarioName(match.adversario_id);
    const adversarioCell = document.createElement('td');
    adversarioCell.className = 'font-medium p-4 text-white text-center';
    adversarioCell.textContent = adversarioName; // Agora exibe o nome do adversário
    row.appendChild(adversarioCell);

    // Resultado cell
    const resultadoCell = document.createElement('td');
    resultadoCell.className = 'font-medium p-4 text-white text-center';
    resultadoCell.textContent = match.resultado; // Vitoria ou Derrota
    row.appendChild(resultadoCell);

    // Placar cell
    const placarCell = document.createElement('td');
    placarCell.className = 'font-medium p-4 text-white text-center';
    placarCell.textContent = match.placar; // Placar ex: 10-8
    row.appendChild(placarCell);

    // Data cell
    const dataCell = document.createElement('td');
    dataCell.className = 'font-medium p-4 text-white text-center';
    const date = new Date(match.data);
    dataCell.textContent = date.toLocaleString(); // Formatar a data
    row.appendChild(dataCell);

    // Tipo cell
    const tipoCell = document.createElement('td');
    tipoCell.className = 'font-medium p-4 text-white text-center';
    tipoCell.textContent = match.tipo === '1v1' ? '1v1' : match.tipo; // Se o tipo for 1v1, mostrar '1v1'
    row.appendChild(tipoCell);

    // Adiciona a linha na tabela
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

  return section; // Sempre retorna o section com a tabela
}


