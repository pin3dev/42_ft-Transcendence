import { navigateTo } from '../router/index';

export function createFooter(): HTMLElement {
  const footer = document.createElement('footer');
  // A classe 'items-center' no footer em si não é necessária se o container já cuida do alinhamento interno.
  // py-8 para um pouco mais de padding vertical geral.
  footer.className = 'bg-arcade-darker border-t border-neon-blue py-3';

  const container = document.createElement('div');
  // Alterações aqui:
  // 'flex flex-col' para empilhar os itens verticalmente.
  // 'items-center' para centralizar os itens filhos (logoSection e bottomSection) horizontalmente.
  // 'gap-6' ou 'gap-8' para criar um espaço vertical entre o logo e a seção de copyright.
  container.className = 'container mx-auto px-1 flex flex-col items-center gap-2';

  // Logo section (não precisa mais do 'grid' wrapper para este layout simples)
  const logoSection = document.createElement('div');
  // O logoSection será centralizado pelo 'items-center' do 'container'.
  // Nenhuma classe de centralização adicional é necessária aqui para o logoSection em si.

  const logoLink = document.createElement('a');
  logoLink.className = 'flex items-center gap-1 cursor-pointer'; // Mantém o ícone e texto alinhados
  logoLink.addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('/');
  });

  const logoIcon = document.createElement('span');
  logoIcon.className = 'text-neon-pink';
  logoIcon.innerHTML = `
 <img src="../public/joystick.png" width="24" height="24" alt="Joystick Icon">
  `;

  const logoText = document.createElement('span');
  logoText.className = 'font-bold text-lg text-white neon-text';
  logoText.innerHTML = 'Ping Pong';

  logoLink.appendChild(logoIcon);
  logoLink.appendChild(logoText);
  logoSection.appendChild(logoLink);

  // Footer bottom section
  const bottomSection = document.createElement('div');
  // Alterações aqui:
  // 'w-full' para que o text-center funcione corretamente na largura disponível.
  // 'text-center' para centralizar o parágrafo de copyright.
  // 'pt-6' ou 'pt-8' para adicionar padding acima do texto de copyright, e 'border-t' para a linha.
  // A classe 'items-center' original aqui não era muito eficaz sem display:flex.
  bottomSection.className = 'w-full border-t border-gray-700 pt-2 text-center'; // Usando uma cor de borda um pouco mais sutil

  const copyright = document.createElement('p');
  copyright.className = 'text-gray-500 text-sm'; // Opcional: texto um pouco menor
  copyright.textContent = `© ${new Date().getFullYear()} Design by Igenial.`;

  bottomSection.appendChild(copyright);

  // Assemble footer
  // Removido o 'grid', adicionando logoSection diretamente
  container.appendChild(logoSection);
  container.appendChild(bottomSection);
  footer.appendChild(container);

  return footer;
}

// Helper function to create footer section (não foi modificada, pois não estava sendo usada no createFooter principal)
// Se você for usá-la, pode precisar de ajustes de layout semelhantes dependendo de onde ela for inserida.
function createFooterSection(title: string, links: Array<{text: string, path: string}>): HTMLElement {
  const section = document.createElement('div');

  const heading = document.createElement('h3');
  heading.className = 'text-neon-green font-semibold mb-3';
  heading.textContent = title;

  const linksList = document.createElement('ul');
  linksList.className = 'space-y-2 text-sm';

  links.forEach(link => {
    const listItem = document.createElement('li');

    const anchor = document.createElement('a');
    anchor.className = 'text-gray-400 hover:text-neon-blue cursor-pointer';
    anchor.textContent = link.text;
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      navigateTo(link.path);
    });

    listItem.appendChild(anchor);
    linksList.appendChild(listItem);
  });

  section.appendChild(heading);
  section.appendChild(linksList);

  return section;
}