// // Front/src/pages/GamePages.ts
// import { createNavbar } from '../components/Navbar';
// import { createFooter } from '../components/Footer';
// import { createLeaderboardPreview } from '../components/LeaderboardPreview';
// import { renderPongGame } from '../components/Game';
// import { createMatchSchedule } from '../components/MatchSchedule';

// // Um bom lugar para armazenar a função de cleanup da página atual
// let cleanupCurrentPage: () => void = () => {};

// export function GamePage(): void { // Esta função agora renderiza uma página que INCLUI o jogo
//   const root = document.getElementById('root');
//   if (!root) {
//     console.error("Elemento 'root' não encontrado!");
//     return;
//   }

//     // Executa a limpeza da página anterior antes de renderizar a nova
//   cleanupCurrentPage();
  
//   // Limpa o root completamente (redundante se o cleanup já faz isso, mas seguro)
//   root.innerHTML = '';
  
//   const GamePageContainer = document.createElement('div');
  
//   GamePageContainer.className = 'flex flex-col min-h-screen bgp-arcade-darkPurple'; 
  
//   GamePageContainer.appendChild(createNavbar());
  
//   const mainContentArea = document.createElement('main');
//   mainContentArea.className = 'flex-grow container mx-auto px-4 py-8';
  
//   // Cria um container específico para a seção do jogo
//   const gameSectionContainer = document.createElement('section');
//   gameSectionContainer.id = 'pong-game-section'; 
//   gameSectionContainer.className = 'my-8 p-4 sm:p-6 rounded-lg bgp-arcade-darkPurple flex flex-col items-center'; 
//   // MUDANÇA 3: Chama a função refatorada, que agora preencherá `gameSectionContainer`
//   const cleanupGame = renderPongGame(gameSectionContainer); 
//   mainContentArea.appendChild(gameSectionContainer);
//   GamePageContainer.appendChild(mainContentArea);
//   GamePageContainer.appendChild(createMatchSchedule()); // Adiciona o preview do leaderboard
  
 
//   GamePageContainer.appendChild(createFooter());
//   root.appendChild(GamePageContainer);

//   // Armazena a função de cleanup do jogo para ser chamada quando a página mudar
//   cleanupCurrentPage = () => {
//     console.log("Limpando GamePage...");
//     cleanupGame(); // Chama a limpeza específica do componente do jogo
//   };
// }

// Front/src/pages/GamePages.ts
import { createNavbar } from '../components/Navbar';
import { createFooter } from '../components/Footer';
import { createLeaderboardPreview } from '../components/LeaderboardPreview';
import { renderPongGame } from '../components/Game';
import { createMatchSchedule } from '../components/MatchSchedule';

let cleanupCurrentPage: () => void = () => {};

export async function GamePage(): Promise<void> {
  const root = document.getElementById('root');
  if (!root) {
    console.error("Elemento 'root' não encontrado!");
    return;
  }

  cleanupCurrentPage();
  root.innerHTML = '';

  const GamePageContainer = document.createElement('div');
  GamePageContainer.className = 'flex flex-col min-h-screen bg-arcade-darkPurple';

  GamePageContainer.appendChild(createNavbar());

  const mainContentArea = document.createElement('main');
  mainContentArea.className = 'flex-grow container mx-auto px-4 py-8';

  const sideBySideContainer = document.createElement('div');
  sideBySideContainer.className = 'flex flex-col lg:flex-row justify-center items-start gap-8';

  // --- Bloco do Jogo (Lado Esquerdo) ---
  const gameSectionContainer = document.createElement('section');
  gameSectionContainer.id = 'pong-game-section';
  // AJUSTE: O jogo agora ocupa 3/4 da largura em telas grandes, ganhando mais espaço.
  gameSectionContainer.className = 'w-full lg:w-3/4 flex flex-col items-center';
  const cleanupGame = renderPongGame(gameSectionContainer);

  // --- Bloco das Partidas (Lado Direito) ---
  const matchScheduleElement = createMatchSchedule();
  // AJUSTE: A lista de partidas agora ocupa apenas 1/4 da largura em telas grandes.
  matchScheduleElement.className += ' w-full lg:w-1/4';

  sideBySideContainer.appendChild(gameSectionContainer);
  sideBySideContainer.appendChild(matchScheduleElement);

  mainContentArea.appendChild(sideBySideContainer);
  mainContentArea.appendChild(await createLeaderboardPreview());

  GamePageContainer.appendChild(mainContentArea);
  GamePageContainer.appendChild(createFooter());
  root.appendChild(GamePageContainer);

  cleanupCurrentPage = () => {
    console.log("Limpando GamePage...");
    cleanupGame();
  };
}