/**
 * Creates the How To Play content section
 */

import { navigateTo } from '../router/index';

export function createHowToPlaySection(): HTMLElement {
  const container = document.createElement('div');
  container.className = 'container mx-auto px-4 py-12';
  
  // Title
  const title = document.createElement('h1');
  title.className = 'text-4xl md:text-5xl lg:text-4xl font-bold mb-4 text-center text-white';
  title.textContent = 'Como Jogar';
  container.appendChild(title);
  
  // Content wrapper
  const contentWrapper = document.createElement('div');
  contentWrapper.className = 'max-w-3xl mx-auto';
  
  // Objective Section
  const objectiveSection = createContentSection('Objetivo do jogo', [
    'O objetivo do Ping Pong é simples: marcar mais pontos que seu oponente. Um ponto é marcado quando a bola passa pelo adversário e atinge a parede atrás dele.',
    'O primeiro jogador a alcançar 5 pontos vence a partida.'
  ]);
  contentWrapper.appendChild(objectiveSection);
  
  // Controls Section
  const controlsSection = document.createElement('div');
  controlsSection.className = 'bg-black/50 border border-purple-500/30 rounded-lg mb-8';
  
  const controlsContent = document.createElement('div');
  controlsContent.className = 'p-6';
  
  const controlsTitle = document.createElement('h2');
  controlsTitle.className = 'text-2xl font-bold mb-4 text-purple-400 text-center';
  controlsTitle.textContent = 'Controles';
  controlsContent.appendChild(controlsTitle);
  
  const controlsGrid = document.createElement('div');
  controlsGrid.className = 'grid grid-cols-1 md:grid-cols-2 gap-6';
  
  // Arrow keys control
  const arrowControl = document.createElement('div');
  arrowControl.className = 'flex items-center';
  
  const arrowKeys = document.createElement('div');
  arrowKeys.className = 'mr-4';
  
  const keysContainer = document.createElement('div');
  keysContainer.className = 'flex flex-col items-center';
  
  const upKey = document.createElement('div');
  upKey.className = 'h-10 w-10 text-white border border-white rounded p-1';
  upKey.textContent = '↑';
  
  const downKey = document.createElement('div');
  downKey.className = 'h-10 w-10 text-white border border-white rounded p-1 mt-1';
  downKey.textContent = '↓';
  
  keysContainer.appendChild(upKey);
  keysContainer.appendChild(downKey);
  arrowKeys.appendChild(keysContainer);
  
  const arrowText = document.createElement('div');
  const arrowDesc = document.createElement('p');
  arrowDesc.className = 'text-gray-300';
  arrowDesc.innerHTML = 'Use as setas <span class="text-white font-bold">para cima</span> e <span class="text-white font-bold">para baixo</span> para mover sua raquete.';
  
  arrowText.appendChild(arrowDesc);
  arrowControl.appendChild(arrowKeys);
  arrowControl.appendChild(arrowText);
  
  // // Pause key control
  // const pauseControl = document.createElement('div');
  // pauseControl.className = 'flex items-center';
  
  // const pauseKey = document.createElement('div');
  // pauseKey.className = 'mr-4';
  
  // const pKey = document.createElement('div');
  // pKey.className = 'h-10 w-10 rounded border border-white flex items-center justify-center text-white font-bold';
  // pKey.textContent = 'P';
  
  // pauseKey.appendChild(pKey);
  
  // const pauseText = document.createElement('div');
  // const pauseDesc = document.createElement('p');
  // pauseDesc.className = 'text-gray-300';
  // pauseDesc.innerHTML = 'Pressione a tecla <span class="text-white font-bold">P</span> para pausar ou retomar o jogo.';
  
  // pauseText.appendChild(pauseDesc);
  // pauseControl.appendChild(pauseKey);
  // pauseControl.appendChild(pauseText);
  
  controlsGrid.appendChild(arrowControl);
  // controlsGrid.appendChild(pauseControl);
  controlsContent.appendChild(controlsGrid);
  controlsSection.appendChild(controlsContent);
  
  contentWrapper.appendChild(controlsSection);
  
  // Tips Section
  const tipsSection = document.createElement('div');
  tipsSection.className = 'bg-black/50 border border-purple-500/30 rounded-lg mb-8';
  
  const tipsContent = document.createElement('div');
  tipsContent.className = 'p-6';
  
  const tipsTitle = document.createElement('h2');
  tipsTitle.className = 'text-2xl font-bold mb-4 text-purple-400';
  tipsTitle.textContent = 'Dicas';
  tipsContent.appendChild(tipsTitle);
  
  const tipsList = document.createElement('ul');
  tipsList.className = 'space-y-3 text-gray-300';
  
  const tips = [
    'A bola aumenta de velocidade a cada rebatida, fique atento!',
    'O ângulo de rebatida é determinado pela posição em que a bola atinge sua raquete.',
    'Rebater com as extremidades da raquete cria ângulos mais fechados, mas é mais arriscado.',
    'Tente prever a trajetória da bola e posicione sua raquete com antecedência.'
  ];
  
  tips.forEach(tip => {
    const li = document.createElement('li');
    li.className = 'flex items-start';
    
    const bullet = document.createElement('span');
    bullet.className = 'text-purple-400 mr-2';
    bullet.textContent = '•';
    
    const text = document.createElement('span');
    text.textContent = tip;
    
    li.appendChild(bullet);
    li.appendChild(text);
    tipsList.appendChild(li);
  });
  
  tipsContent.appendChild(tipsList);
  tipsSection.appendChild(tipsContent);
  
  contentWrapper.appendChild(tipsSection);
  
  // Navigation Buttons
  const navButtons = document.createElement('div');
  navButtons.className = 'flex justify-center gap-4 mt-10';
  
  const backButton = document.createElement('a');
  backButton.href = '/';
  backButton.className = 'px-4 py-2 border border-purple-500 rounded text-purple-400 hover:bg-purple-500/20 transition flex items-center';
  
  const backChevron = document.createElement('span');
  backChevron.className = 'mr-2';
  backChevron.textContent = '‹';
  
  backButton.appendChild(backChevron);
  backButton.appendChild(document.createTextNode('Voltar'));
  
  // const playButton = document.createElement('a');
  // playButton.href = '/Game';
  // playButton.className = 'px-4 py-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded text-white hover:opacity-90 transition flex items-center';
  
  // const playIcon = document.createElement('span');
  // playIcon.className = 'mr-2';
  // playIcon.textContent = '▶';
  
  // playButton.appendChild(playIcon);
  // playButton.appendChild(document.createTextNode('Jogar Agora'));

   const primaryButton = document.createElement('button');
    primaryButton.className = 'px-4 py-2 bg-neon-pink text-arcade-darker hover:bg-neon-purple hover:text-white text-lg flex items-center gap-2 animate-pulse-neon rounded';
    primaryButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="5 3 19 12 5 21 5 3"></polygon>
      </svg>
      Jogar Agora
    `;
    primaryButton.addEventListener('click', () => navigateTo('/Login'));
  
  navButtons.appendChild(backButton);
  navButtons.appendChild(primaryButton);
  
  contentWrapper.appendChild(navButtons);
  container.appendChild(contentWrapper);
  
  return container;
}

function createContentSection(title: string, paragraphs: string[]): HTMLElement {
  const section = document.createElement('div');
  section.className = 'bg-black/50 border border-purple-500/30 rounded-lg mb-8';
  
  const content = document.createElement('div');
  content.className = 'p-6';
  
  const heading = document.createElement('h2');
  heading.className = 'text-2xl font-bold mb-4 text-purple-400';
  heading.textContent = title;
  content.appendChild(heading);
  
  paragraphs.forEach((text, index) => {
    const p = document.createElement('p');
    p.className = 'text-gray-300' + (index < paragraphs.length - 1 ? ' mb-4' : '');
    p.textContent = text;
    content.appendChild(p);
  });
  
  section.appendChild(content);
  return section;
}
