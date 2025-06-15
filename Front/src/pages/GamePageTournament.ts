// Front/src/pages/GamePages.ts
import { createNavbar } from '../components/Navbar';
import { createFooter } from '../components/Footer';
import { renderPongGameTournament, fetchUserName } from '../components/GameTournament';
import { createMatchSchedule, updateMatchSchedule, MatchData } from '../components/MatchSchedule';
import { createRankingTable, updateRankingTable, RankingData } from '../components/RankingTable';

// Um bom lugar para armazenar a função de cleanup da página atual
let cleanupCurrentPage: () => void = () => { };

export function GamePageTournament(): void { // Esta função agora renderiza uma página que INCLUI o jogo
  const root = document.getElementById('root');
  if (!root) {
    console.error("Elemento 'root' não encontrado!");
    return;
  }

  // Executa a limpeza da página anterior antes de renderizar a nova
  cleanupCurrentPage();

  // Limpa o root completamente (redundante se o cleanup já faz isso, mas seguro)
  root.innerHTML = '';

  const GamePageContainer = document.createElement('div');
  GamePageContainer.className = 'flex flex-col min-h-screen bgp-arcade-darkPurple';
  GamePageContainer.appendChild(createNavbar());

  const sideColumn = document.createElement('div');
  sideColumn.className = 'flex flex-col gap-6 w-full lg:w-auto lg:min-w-[400px]';


  const rankingComponent = createRankingTable();
  const rankingTableBody = rankingComponent.querySelector('#ranking-table-body') as HTMLElement;
  sideColumn.appendChild(rankingComponent);

  const matchScheduleComponent = createMatchSchedule();
  const matchListContainer = matchScheduleComponent.querySelector('#match-list-container') as HTMLElement;
  sideColumn.appendChild(matchScheduleComponent);

  const handleRankingUpdate = (rankingsFromSocket: any[]) => {
    // A API já envia os dados no formato que `RankingData` espera, então o map é direto.
    const formattedRankings: RankingData[] = rankingsFromSocket.map(r => ({ ...r }));
    if (rankingTableBody) {
      updateRankingTable(rankingTableBody, formattedRankings);
    }
  };

  const handleTournamentUpdate = async (matchesFromSocket: any[]) => {
    console.log("Recebido dados de partidas. Buscando nomes...", matchesFromSocket);

    // Mostra um estado de "carregando" (opcional, mas recomendado)
    if (matchListContainer) {
      updateMatchSchedule(matchListContainer, [{ id: 1, player1Name: 'Carregando...', player2Name: 'Carregando...', score1: 0, score2: 0 }]);
    }

    // Cria um array de Promises. Cada promise resolverá para um objeto MatchData completo.
    const formattedMatchesPromises = matchesFromSocket.map(async (match, index) => {
      // Busca os dois nomes da partida em paralelo
      const [p1Name, p2Name] = await Promise.all([
        fetchUserName(match.userId1),
        fetchUserName(match.userId2)
      ]);

      // Retorna o objeto no formato esperado por `MatchData`
      return {
        id: index + 1,
        player1Name: p1Name,
        score1: match.player1Score,
        player2Name: p2Name,
        score2: match.player2Score,
      };
    });

    // Espera TODAS as buscas de nome terminarem
    const formattedMatches = await Promise.all(formattedMatchesPromises);

    // Agora, atualiza a UI com os dados completos
    if (matchListContainer) {
      updateMatchSchedule(matchListContainer, formattedMatches);
      console.log("Tabela de partidas atualizada com nomes.");
    }
  };



  const mainContentArea = document.createElement('main');
  mainContentArea.className = 'flex flex-col lg:flex-row justify-center items-start gap-8';


  const gameSectionContainer = document.createElement('section');
  gameSectionContainer.id = 'pong-game-section';
  gameSectionContainer.className = 'my-8 p-4 sm:p-6 rounded-lg bgp-arcade-darkPurple flex flex-col items-center';

  const cleanupGame = renderPongGameTournament(gameSectionContainer, {
    onTournamentUpdate: handleTournamentUpdate,
    onRankingUpdate: handleRankingUpdate
  });

  mainContentArea.appendChild(gameSectionContainer);
  mainContentArea.appendChild(createMatchSchedule());
  GamePageContainer.appendChild(mainContentArea);
  GamePageContainer.appendChild(createRankingTable())

  GamePageContainer.appendChild(createFooter());
  root.appendChild(GamePageContainer);

  // Armazena a função de cleanup do jogo para ser chamada quando a página mudar
  cleanupCurrentPage = () => {
    console.log("Limpando GamePage...");
    cleanupGame(); // Chama a limpeza específica do componente do jogo
  };
}
