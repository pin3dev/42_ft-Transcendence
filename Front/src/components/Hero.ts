import { navigateTo } from '../router/index';

export function createHero(): HTMLElement {
  const heroSection = document.createElement('div');
  heroSection.className = 'relative py-12 md:py-24 overflow-hidden';
  
  // Grid overlay
  const gridOverlay = document.createElement('div');
  gridOverlay.className = 'absolute inset-0 z-0';
  gridOverlay.style.backgroundSize = '50px 50px';
  gridOverlay.style.backgroundPosition = 'center center';
  
  // Content
  const content = document.createElement('div');
  content.className = 'container mx-auto px-6 relative z-10';
  
  const flexContainer = document.createElement('div');
  flexContainer.className = 'flex flex-col lg:flex-row items-center gap-10';
  
  // Left column (text)
  const leftColumn = document.createElement('div');
  leftColumn.className = 'lg:w-1/2 text-center lg:text-left';
  
  const heroTitle = document.createElement('h1');
  heroTitle.className = 'text-4xl md:text-5xl lg:text-4xl font-bold mb-4';
  heroTitle.innerHTML = `
    <span class="text-white">FT_TRANSCENDENCE!</span>
  `;
  
  const heroDescription = document.createElement('p');
  heroDescription.className = 'text-xl text-gray-300 mb-8';
  heroDescription.textContent = 'Pronto para um Pong turbinado? Criámos este site com torneios, multiplayer e muito mais. Chega de conversa, é hora de jogar e brilhar!';
  
  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'flex flex-col sm:flex-row gap-4 justify-center lg:justify-start';
  
  const primaryButton = document.createElement('button');
  primaryButton.className = 'bg-neon-pink text-arcade-darker hover:bg-neon-purple hover:text-white px-8 py-6 text-lg flex items-center gap-2 animate-pulse-neon rounded';
  primaryButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
    Jogar Agora
  `;
  primaryButton.addEventListener('click', () => navigateTo('/Login'));
  
  const secondaryButton = document.createElement('button');
  secondaryButton.className = 'border-neon-blue text-neon-blue hover:bg-neon-blue hover:text-arcade-darker px-8 py-6 text-lg border rounded';
  secondaryButton.textContent = 'Como Jogar';
  secondaryButton.addEventListener('click', () => navigateTo('/ComoJogar'));
  
  buttonContainer.appendChild(primaryButton);
  buttonContainer.appendChild(secondaryButton);
  
  leftColumn.appendChild(heroTitle);
  leftColumn.appendChild(heroDescription);
  leftColumn.appendChild(buttonContainer);
  
  // Right column (ping pong table)
  const rightColumn = document.createElement('div');
  rightColumn.className = 'lg:w-1/2 relative';
  
  const tableContainer = document.createElement('div');
  tableContainer.className = 'aspect-square w-full max-w-md mx-auto relative';
  
  const pingPongTable = document.createElement('div');
  pingPongTable.className = 'absolute inset-0 bg-arcade-darkPurple rounded-lg border-4 border-neon-blue overflow-hidden';
  
  const tableNet = document.createElement('div');
  tableNet.className = 'absolute inset-0 flex items-center justify-center';
  const net = document.createElement('div');
  net.className = 'h-full w-1 bg-neon-blue opacity-80';
  tableNet.appendChild(net);
  
  const ball = document.createElement('div');
  ball.className = 'absolute h-4 w-4 rounded-full bg-neon-orange animate-float';
  ball.style.left = '65%';
  ball.style.top = '40%';
  
  const leftPaddle = document.createElement('div');
  leftPaddle.className = 'absolute h-16 w-2 bg-neon-green left-4 top-1/2 -translate-y-1/2';
  
  const rightPaddle = document.createElement('div');
  rightPaddle.className = 'absolute h-16 w-2 bg-neon-pink right-4 top-1/2 -translate-y-1/2';
  
  pingPongTable.appendChild(tableNet);
  pingPongTable.appendChild(ball);
  pingPongTable.appendChild(leftPaddle);
  pingPongTable.appendChild(rightPaddle);
  
  const glowEffect1 = document.createElement('div');
  glowEffect1.className = 'absolute -inset-2 bg-neon-blue opacity-10 blur-xl rounded-lg';
  
  const glowEffect2 = document.createElement('div');
  glowEffect2.className = 'absolute -inset-1 bg-neon-purple opacity-10 blur-md rounded-lg';
  
  tableContainer.appendChild(glowEffect1);
  tableContainer.appendChild(glowEffect2);
  tableContainer.appendChild(pingPongTable);
  rightColumn.appendChild(tableContainer);
  
  flexContainer.appendChild(leftColumn);
  flexContainer.appendChild(rightColumn);
  
  // Features section
  const featuresGrid = document.createElement('div');
  featuresGrid.className = 'grid grid-cols-1 md:grid-cols-3 gap-8 mt-16';
  
  const features = [
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`,
      title: 'Jogabilidade Rápida',
      description: 'Controles responsivos e matchmaking instantâneo para você entrar na ação sem demora.',
      color: 'neon-blue'
    },
    {
      icon: `<img src="../public/joystick.png" width="24" height="24" alt="Joystick Icon">`,
      title: 'Visual Arcade',
      description: 'Gráficos neon vibrantes e efeitos visuais incríveis para uma experiência arcade autêntica.',
      color: 'neon-pink'
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
      title: 'Torneios',
      description: 'Participe de torneios regulares com outros jogadores e amigos.',
      color: 'neon-green'
    }
  ];
  
  features.forEach(feature => {
    const featureCard = document.createElement('div');
    featureCard.className = 'bg-arcade-darker bg-opacity-80 p-6 border border-' + feature.color + ' rounded-lg backdrop-blur-sm';
    
    const iconContainer = document.createElement('div');
    iconContainer.className = `flex items-center justify-center bg-${feature.color}/10 p-3 rounded-full w-14 h-14 mb-4`;
    iconContainer.innerHTML = feature.icon;
    iconContainer.querySelector('svg')?.classList.add(`text-${feature.color}`);
    
    const featureTitle = document.createElement('h3');
    featureTitle.className = `text-${feature.color} text-xl font-semibold mb-2`;
    featureTitle.textContent = feature.title;
    
    const featureDesc = document.createElement('p');
    featureDesc.className = 'text-gray-300';
    featureDesc.textContent = feature.description;
    
    featureCard.appendChild(iconContainer);
    featureCard.appendChild(featureTitle);
    featureCard.appendChild(featureDesc);
    
    featuresGrid.appendChild(featureCard);
  });
  
  // Mount everything together
  content.appendChild(flexContainer);
  content.appendChild(featuresGrid);
  
  heroSection.appendChild(gridOverlay);
  heroSection.appendChild(content);
  
  return heroSection;
}