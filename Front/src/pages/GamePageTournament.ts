// Front/src/pages/GamePages.ts
import { createNavbar } from '../components/Navbar';
import { createFooter } from '../components/Footer';
import { renderPongGameTournament } from '../components/GameTournament';
import { createMatchSchedule, updateMatchSchedule, MatchData } from '../components/MatchSchedule';

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

  const matchScheduleComponent = createMatchSchedule();

  const matchListContainer = matchScheduleComponent.querySelector('#match-list-container') as HTMLElement;
  if (!matchListContainer) {
    console.error("Container '#match-list-container' não encontrado no componente MatchSchedule.");
    return;
  }
  const handleTournamentUpdate = (matchesFromSocket: any[]) => {
    console.log("handleTournamentUpdate chamado com:", matchesFromSocket);
    const formattedMatches: MatchData[] = matchesFromSocket.map((match, index) => ({
      id: index + 1,
      player1Name: match.player1Name,
      score1: match.player1Score,
      player2Name: match.player2Name,
      score2: match.player2Score,
    }));
    updateMatchSchedule(matchListContainer, formattedMatches);
  };



  const mainContentArea = document.createElement('main');
  mainContentArea.className = 'flex flex-col lg:flex-row justify-center items-start gap-8';

  // Cria um container específico para a seção do jogo
  const gameSectionContainer = document.createElement('section');
  gameSectionContainer.id = 'pong-game-section';
  gameSectionContainer.className = 'my-8 p-4 sm:p-6 rounded-lg bgp-arcade-darkPurple flex flex-col items-center';
  // MUDANÇA 3: Chama a função refatorada, que agora preencherá `gameSectionContainer`
  const cleanupGame = renderPongGameTournament(gameSectionContainer, handleTournamentUpdate);
  mainContentArea.appendChild(gameSectionContainer);
  mainContentArea.appendChild(createMatchSchedule());
  GamePageContainer.appendChild(mainContentArea);

  GamePageContainer.appendChild(createFooter());
  root.appendChild(GamePageContainer);

  // Armazena a função de cleanup do jogo para ser chamada quando a página mudar
  cleanupCurrentPage = () => {
    console.log("Limpando GamePage...");
    cleanupGame(); // Chama a limpeza específica do componente do jogo
  };
}
