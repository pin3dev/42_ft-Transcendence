
import { createNavbar } from '../components/Navbar';
import { createHero } from '../components/Hero';
import { createCreatorsSection } from '../components/Creators';
import { createLeaderboardPreview } from '../components/LeaderboardPreview';
import { createFooter } from '../components/Footer';

export function renderHome(): void {
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
  main.appendChild(createLeaderboardPreview());
  
  
  container.appendChild(main);
  container.appendChild(createFooter());
  
  // Insere no DOM
  root.appendChild(container);
}