// Front/src/pages/GamePages.ts

import { createNavbar } from '../components/Navbar';
import { createFooter } from '../components/Footer';
// CORREÇÃO: Certifique-se de que fetchUserName está sendo exportado de GameTournament.ts
import { renderPongGameTournament, fetchUserName } from '../components/GameTournament'; 
import { createMatchSchedule, updateMatchSchedule, MatchData } from '../components/MatchSchedule';
import { createRankingTable, updateRankingTable, RankingData } from '../components/RankingTable';

let cleanupCurrentPage: () => void = () => {};

export function GamePageTournament(): void {
  console.log("Iniciando renderização da GamePageTournament..."); // LOG 1

  const root = document.getElementById('root');
  if (!root) {
    console.error("ERRO CRÍTICO: Elemento 'root' não encontrado!");
    return;
  }

  cleanupCurrentPage();
  root.innerHTML = '';

  const GamePageContainer = document.createElement('div');
  GamePageContainer.className = 'flex flex-col min-h-screen bg-arcade-darkPurple';
  GamePageContainer.appendChild(createNavbar());
  
  const mainContentArea = document.createElement('main');
  mainContentArea.className = 'flex flex-col lg:flex-row justify-center items-start gap-8 p-4 w-full max-w-7xl mx-auto';

  const sideColumn = document.createElement('div');
  sideColumn.className = 'flex flex-col gap-6 w-full lg:w-auto lg:min-w-[400px] mt-8';

  // --- Setup da Tabela de Classificação ---
  const rankingComponent = createRankingTable();
  const rankingTableBody = rankingComponent.querySelector('#ranking-table-body') as HTMLElement;
  sideColumn.appendChild(rankingComponent);

  // --- Setup da Tabela de Partidas ---
  const matchScheduleComponent = createMatchSchedule();
  const matchListContainer = matchScheduleComponent.querySelector('#match-list-container') as HTMLElement;
  sideColumn.appendChild(matchScheduleComponent);

  // --- VERIFICAÇÃO CRUCIAL DOS CONTAINERS ---
  if (!rankingTableBody) {
      console.error("ERRO: Container '#ranking-table-body' não foi encontrado!");
  }
  if (!matchListContainer) {
      console.error("ERRO: Container '#match-list-container' não foi encontrado!");
  }
  console.log("LOG 2: Containers das tabelas encontrados:", { rankingTableBody, matchListContainer });

  // --- CALLBACKS PARA ATUALIZAÇÃO DA UI ---

  const handleRankingUpdate = (rankingsFromSocket: any[]) => {
    console.log("LOG 4a: handleRankingUpdate ACIONADO com:", rankingsFromSocket);
    
    // Verificação de segurança
    if (!rankingTableBody) {
        console.error("ERRO: Tentando atualizar tabela de ranking, mas o container não foi encontrado.");
        return;
    }
    const formattedRankings: RankingData[] = rankingsFromSocket.map(r => ({ ...r }));
    updateRankingTable(rankingTableBody, formattedRankings);
    console.log("LOG 5a: Tabela de Ranking ATUALIZADA.");
  };

  const handleTournamentUpdate = async (matchesFromSocket: any[]) => {
    console.log("LOG 4b: handleTournamentUpdate ACIONADO com:", matchesFromSocket);

    // Verificação de segurança
    if (!matchListContainer) {
        console.error("ERRO: Tentando atualizar tabela de partidas, mas o container não foi encontrado.");
        return;
    }
    
    try {
        updateMatchSchedule(matchListContainer, [{ id: 1, player1Name: 'Buscando nomes...', player2Name: '...', score1: 0, score2: 0 }]);

        const formattedMatchesPromises = matchesFromSocket.map(async (match, index) => {
            const [p1Name, p2Name] = await Promise.all([
                fetchUserName(match.userId1),
                fetchUserName(match.userId2)
            ]);
            return {
                id: index + 1,
                player1Name: p1Name,
                score1: match.player1Score,
                player2Name: p2Name,
                score2: match.player2Score,
            };
        });

        const formattedMatches = await Promise.all(formattedMatchesPromises);
        console.log("LOG 5b: Nomes buscados com sucesso. Dados formatados:", formattedMatches);

        updateMatchSchedule(matchListContainer, formattedMatches);
        console.log("LOG 6b: Tabela de Partidas ATUALIZADA.");

    } catch (error) {
        console.error("ERRO CRÍTICO dentro de handleTournamentUpdate:", error);
    }
  };

  // --- RENDERIZAÇÃO DOS COMPONENTES ---

  const gameSectionContainer = document.createElement('section');
  gameSectionContainer.id = 'pong-game-section';
  gameSectionContainer.className = 'my-8 flex-grow flex flex-col items-center';
  
  console.log("LOG 3: Chamando renderPongGameTournament com os callbacks.");
  const cleanupGame = renderPongGameTournament(gameSectionContainer, { 
    onTournamentUpdate: handleTournamentUpdate,
    onRankingUpdate: handleRankingUpdate 
  });

  mainContentArea.appendChild(gameSectionContainer);
  mainContentArea.appendChild(sideColumn);

  GamePageContainer.appendChild(mainContentArea);
  GamePageContainer.appendChild(createFooter());
  root.appendChild(GamePageContainer);

  cleanupCurrentPage = () => {
    console.log("Limpando GamePageTournament...");
    cleanupGame();
  };
}