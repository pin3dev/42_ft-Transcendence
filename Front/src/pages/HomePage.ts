
import { createNavbar } from '../components/Navbar';
import { createHero } from '../components/Hero';
import { createCreatorsSection } from '../components/Creators';
import { createLeaderboardPreview } from '../components/LeaderboardPreview';
import { createFooter } from '../components/Footer';

export async function renderHome(): Promise<void> {
  const root = document.getElementById('root');
  if (!root) return;
  
  // Cria a estrutura da página
  const container = document.createElement('div');
  container.className = 'min-h-screen flex flex-col bgp-arcade-darkPurple';
  
  // Adiciona os componentes
  container.appendChild(createNavbar());
  
  const main = document.createElement('main');
  main.className = 'flex-grow container mx-auto px-4 py-8';
  
  main.appendChild(createHero());
  main.appendChild(createCreatorsSection());

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

  main.appendChild(header);

  container.appendChild(main);
  container.appendChild(createFooter());
  root.appendChild(container);

  // Agora, chama a API para adicionar o leaderboard
  setTimeout(async () => {
    const leaderboardSection = await createLeaderboardPreview();
    main.appendChild(leaderboardSection);
  }, 0);
}