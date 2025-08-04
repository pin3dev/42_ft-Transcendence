// src/pages/HowToPlayPage.ts
// (A mesma que você já tem, apenas garanta que 'main' não limite demais a largura)
import { createNavbar } from '../components/Navbar';
import { createHowToPlaySection } from '../components/HowToPlaySection';
import { createFooter } from '../components/Footer';

function clearRoot(rootElement: HTMLElement): void {
  while (rootElement.firstChild) {
    rootElement.removeChild(rootElement.firstChild);
  }
}

export function renderHowToPlayPage(): void {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Root element not found!');
    return;
  }
  clearRoot(root);

  const pageContainer = document.createElement('div');
  pageContainer.className = 'min-h-screen flex flex-col bg-arcade-dark'; // Fundo global aqui

  pageContainer.appendChild(createNavbar());

  const main = document.createElement('main');
  // Removido 'container mx-auto' daqui, pois o conteúdo interno já se centraliza com max-w-3xl
  main.className = 'flex-grow px-4 py-8'; // Apenas padding

  main.appendChild(createHowToPlaySection());

  pageContainer.appendChild(main);
  pageContainer.appendChild(createFooter());

  root.appendChild(pageContainer);
}