// Defina uma interface para o tipo de dados do colaborador (opcional, mas bom para TypeScript)
interface Creator {
  name: string;
  role: string;
  bio: string;
  imageUrl: string; // Caminho para a imagem
  links?: Array<{ platform: string; url: string; iconSvg?: string }>;
}

// Dados dos colaboradores (exemplo - mantenha seus dados aqui)
const creatorsData: Creator[] = [
  {
    name: 'Clara Franco',
    role: 'Engenheira de Software (Cyber Security)',
    bio: '',
    imageUrl: '../public/creators/clara.jpeg',
    links: [
      { platform: 'GitHub', url: 'https://github.com/anasilva' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/anasilva' }
    ]
  },
  {
    name: 'David Cavalcante',
    role: 'Engenheiro de Software (Game Developer)',
    bio: '',
    imageUrl: '../public/creators/dmanoel-.jpeg',
    links: [
      { platform: 'GitHub', url: 'https://github.com/anasilva' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/anasilva' }
    ]
  },
  {
    name: 'Isabela Genial',
    role: 'Engenheira de Software (Designer UI/UX)',
    bio: '',
    imageUrl: '../public/creators/isa.jpeg',
    links: [
      { platform: 'GitHub', url: 'https://github.com/anasilva' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/anasilva' }
    ]
  },
  {
    name: 'Ivany Batista',
    role: 'Engenheira de Software (Backend Developer)',
    bio: '',
    imageUrl: '../public/creators/Ivy.jpeg', 
    links: [
      { platform: 'GitHub', url: 'https://github.com/anasilva' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/anasilva' }
    ]
  },
  {
    name: 'Jaqueline Ribeiro',
    role: 'Engenheira de Software (Developer)',
    bio: '',
    imageUrl: '../public/creators/Jaque.png', 
    links: [
      { platform: 'GitHub', url: 'https://github.com/anasilva' },
      { platform: 'LinkedIn', url: 'https://linkedin.com/in/anasilva' }
    ]
  },
];

// Função auxiliar para criar o card de um colaborador (COM TAMANHOS REDUZIDOS)
function createCreatorCard(creator: Creator): HTMLElement {
  const card = document.createElement('div');
  // Reduzido padding (p-4), mantido flex para alinhamento interno.
  card.className = 'bg-arcade-dark p-4 rounded-lg shadow-lg text-center flex flex-col items-center';

  const image = document.createElement('img');
  image.src = creator.imageUrl;
  image.alt = `Foto de ${creator.name}`;
  // Reduzido tamanho da imagem (w-24 h-24), margem (mb-3)
  image.className = 'w-24 h-24 rounded-full object-cover mb-3 border-2 border-neon-pink';

  const name = document.createElement('h3');
  // Reduzido tamanho da fonte (text-lg)
  name.className = 'text-lg font-bold text-neon-green mb-1';
  name.textContent = creator.name;

  const role = document.createElement('p');
  // Reduzido tamanho da fonte (text-xs), margem (mb-2)
  role.className = 'text-xs text-neon-blue mb-2 font-semibold';
  role.textContent = creator.role;

  const bio = document.createElement('p');
  // Mantido text-sm para bio, mas pode ser text-xs se precisar de mais compacto. Reduzida margem (mb-3)
  bio.className = 'text-sm text-gray-400 mb-3'; // Removido flex-grow para alturas mais naturais
  bio.textContent = creator.bio; // Considere limitar o comprimento da bio se ainda estiver muito grande

  card.appendChild(image);
  card.appendChild(name);
  card.appendChild(role);
  card.appendChild(bio);

  if (creator.links && creator.links.length > 0) {
    const linksContainer = document.createElement('div');
    // Reduzido espaçamento (space-x-2), margem superior (mt-2 ou mt-3)
    linksContainer.className = 'flex space-x-2 mt-2'; // mt-auto removido, altura do card será mais natural

    creator.links.forEach(link => {
      const anchor = document.createElement('a');
      anchor.href = link.url;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
      anchor.className = 'text-gray-400 hover:text-neon-pink transition-colors text-xl'; // Aumentei um pouco o tamanho do ícone/link
      // Se usar SVGs como innerHTML, ajuste o tamanho deles via width/height no SVG.
      anchor.innerHTML = link.iconSvg ? link.iconSvg : `<span class="text-xs">${link.platform}</span>`; // Se for texto, garantir que seja pequeno
      linksContainer.appendChild(anchor);
    });
    card.appendChild(linksContainer);
  }

  return card;
}


export function createCreatorsSection(): HTMLElement {
  const section = document.createElement('section');
  section.className = 'py-12 bg-arcade-darker-creator'; // Pode reduzir o py-16 para py-12 também

  const container = document.createElement('div');
  container.className = 'container mx-auto px-4 md:px-6'; // Pode reduzir o px-6 para px-4

  const header = document.createElement('div');
  header.className = 'text-center mb-10 md:mb-12'; // Reduzido o margin bottom

  const title = document.createElement('h2');
  // Pode reduzir o tamanho da fonte do título principal se necessário
  title.className = 'text-3xl md:text-4xl font-bold mb-3 neon-text text-white'; // mb-4 -> mb-3
  title.textContent = 'Nossa Equipe Incrível';

  const subtitle = document.createElement('p');
  // Pode reduzir o tamanho da fonte do subtítulo se necessário
  subtitle.className = 'text-md md:text-lg text-gray-300 max-w-2xl mx-auto'; // text-lg/xl -> text-md/lg, max-w-3xl -> max-w-2xl
  subtitle.textContent = 'Conheça as mentes brilhantes que tornaram este projeto uma realidade.';

  header.appendChild(title);
  header.appendChild(subtitle);

  const grid = document.createElement('div');
  // Reduzido o gap (gap-6).
  // Mantido sm:grid-cols-2 lg:grid-cols-3. Se com 5 cards ainda for muito,
  // e você quiser todos numa linha em telas grandes, pode usar lg:grid-cols-5 ou xl:grid-cols-5.
  // Ou, para telas médias, md:grid-cols-3.
  grid.className = ' grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 gap-6';
  // Adicionei xl:grid-cols-5 para que em telas bem largas, os 5 caibam em uma linha.
  // Adicionei md:grid-cols-3 para um passo intermediário.

  creatorsData.forEach(creator => {
    const creatorCard = createCreatorCard(creator);
    grid.appendChild(creatorCard);
  });

  container.appendChild(header);
  container.appendChild(grid);
  section.appendChild(container);

  return section;
}